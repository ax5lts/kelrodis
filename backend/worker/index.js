const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const enc=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
async function signature(value,secret){const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',k,enc.encode(value)));}
function equal(a,b){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
async function authorized(req,env){if(!env.ADMIN_PASSWORD)return false;const t=(req.headers.get('authorization')||'').replace(/^Bearer /,'');const [expires,nonce,sig]=t.split('.');if(!expires||!nonce||!sig||Number(expires)<Date.now())return false;return equal(sig,await signature(`${expires}.${nonce}`,env.ADMIN_PASSWORD));}
async function body(req){if(Number(req.headers.get('content-length')||0)>16384)throw Error('Per didelė užklausa.');const text=await req.text();if(text.length>16384)throw Error('Per didelė užklausa.');try{return JSON.parse(text);}catch{throw Error('Neteisingi duomenys.');}}
function validate(d){const lat=Number(d.lat),lon=Number(d.lon),direction=d.direction===''||d.direction==null?null:Number(d.direction);const address=String(d.address||'').trim(),stairwell=String(d.stairwell||'').trim(),apartments=String(d.apartments||'').trim(),note=String(d.note||'').trim();if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<53.8||lat>56.6||lon<20.8||lon>26.9||!address||!stairwell||!apartments||address.length>180||stairwell.length>60||apartments.length>80||note.length>300||(direction!==null&&(!Number.isInteger(direction)||direction<0||direction>359)))throw Error('Patikrinkite laukus ir vietą Lietuvos žemėlapyje.');return [lat,lon,address,stairwell,apartments,note,direction,new Date().toISOString()];}
export default {async fetch(req,env){const url=new URL(req.url),p=url.pathname;try{
 if(p==='/api/entrances'&&req.method==='GET'){const result=await env.DB.prepare('SELECT * FROM entrances ORDER BY updated_at DESC').all();return json(result.results);}
 if(p==='/api/login'&&req.method==='POST'){
  const ip=req.headers.get('cf-connecting-ip')||'unknown', now=Date.now();const attempt=await env.DB.prepare('SELECT count, until_ms FROM login_attempts WHERE ip=?').bind(ip).first();if(attempt&&attempt.until_ms>now&&attempt.count>=10)return json({error:'Per daug bandymų. Pabandykite vėliau.'},429);
  const d=await body(req);const candidate=String(d.password||'');const candidateHash=hex(await crypto.subtle.digest('SHA-256',enc.encode(candidate)));const expectedHash=hex(await crypto.subtle.digest('SHA-256',enc.encode(env.ADMIN_PASSWORD||'')));
  if(!env.ADMIN_PASSWORD||!equal(candidateHash,expectedHash)){const count=attempt&&attempt.until_ms>now?attempt.count+1:1;const until=attempt&&attempt.until_ms>now?attempt.until_ms:now+900000;await env.DB.prepare('INSERT INTO login_attempts(ip,count,until_ms) VALUES(?,?,?) ON CONFLICT(ip) DO UPDATE SET count=excluded.count,until_ms=excluded.until_ms').bind(ip,count,until).run();return json({error:'Neteisingas slaptažodis.'},401);}
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip=?').bind(ip).run();const expires=String(now+8*60*60*1000),nonce=crypto.randomUUID(),payload=`${expires}.${nonce}`;return json({token:`${payload}.${await signature(payload,env.ADMIN_PASSWORD)}`});
 }
 if(p==='/api/logout'&&req.method==='POST')return json({ok:true});
 const m=p.match(/^\/api\/entrances(?:\/(\d+))?$/);if(m&&['POST','PUT','DELETE'].includes(req.method)){
  if(!await authorized(req,env))return json({error:'Prisijunkite kaip administratorius.'},401);
  if((req.method==='POST'&&m[1])||(req.method!=='POST'&&!m[1]))return json({error:'Nerasta.'},404);
  if(req.method==='DELETE'){const result=await env.DB.prepare('DELETE FROM entrances WHERE id=?').bind(Number(m[1])).run();return json({ok:!!result.meta.changes},result.meta.changes?200:404);}
  const values=validate(await body(req));if(req.method==='POST'){const result=await env.DB.prepare('INSERT INTO entrances(lat,lon,address,stairwell,apartments,note,direction,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(...values).run();return json({id:result.meta.last_row_id},201);}
  const result=await env.DB.prepare('UPDATE entrances SET lat=?,lon=?,address=?,stairwell=?,apartments=?,note=?,direction=?,updated_at=? WHERE id=?').bind(...values,Number(m[1])).run();return json({ok:!!result.meta.changes},result.meta.changes?200:404);
 }
 if(p.startsWith('/api/'))return json({error:'Nerasta.'},404);
 if(req.method!=='GET'&&req.method!=='HEAD')return json({error:'Metodas nepalaikomas.'},405);
 const name=p==='/'?'/index.html':p, asset=ASSETS[name];if(!asset)return new Response('Nerasta',{status:404});const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',webmanifest:'application/manifest+json',png:'image/png'};const ext=name.split('.').pop();const bytes=Uint8Array.from(atob(asset),c=>c.charCodeAt(0));return new Response(req.method==='HEAD'?null:bytes,{headers:{'content-type':types[ext]||'application/octet-stream','x-content-type-options':'nosniff','cache-control':name==='/sw.js'?'no-cache':'public, max-age=300'}});
 }catch(e){console.error('Request failed',e);return json({error:'Nepavyko įvykdyti užklausos.'},400);}}};
