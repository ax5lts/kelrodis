const {JSDOM}=require('jsdom');const fs=require('fs'),assert=require('assert'),path=require('path');
const w=new JSDOM('<div id="map"><div class="leaflet-control"></div></div>',{runScripts:'outside-only',pretendToBeVisual:true}).window;
w.PointerEvent=function(){};w.eval(fs.readFileSync(path.join(__dirname,'../web/map-long-press.js'),'utf8'));
const map=w.document.getElementById('map'),hits=[];let enabled=true;
w.KelrodisLongPress.attach({element:map,delay:30,onHold:p=>hits.push(p),isEnabled:()=>enabled});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function event(target,type,id,x=10,y=10,primary=true){const e=new w.Event(type,{bubbles:true,cancelable:true});Object.defineProperties(e,{pointerId:{value:id},clientX:{value:x},clientY:{value:y},button:{value:0},isPrimary:{value:primary}});target.dispatchEvent(e);}
(async()=>{
 event(map,'pointerdown',1);event(map,'pointerup',1);await wait(45);assert.equal(hits.length,0,'tap');
 event(map,'pointerdown',1,13,24);await wait(45);assert.equal(hits.length,1,'hold');assert.equal(hits[0].x,13);assert.equal(hits[0].y,24);event(map,'pointerup',1);
 event(map,'pointerdown',1);event(map,'pointermove',1,30,10);await wait(45);event(map,'pointerup',1);assert.equal(hits.length,1,'drag');
 event(map,'pointerdown',1);event(map,'pointerdown',2,12,12,false);await wait(45);event(map,'pointerup',2);event(map,'pointerup',1);assert.equal(hits.length,1,'two-finger gesture');
 event(map,'pointerdown',1);event(map,'pointercancel',1);await wait(45);assert.equal(hits.length,1,'cancel');
 event(map.querySelector('.leaflet-control'),'pointerdown',1);await wait(45);event(map,'pointerup',1);assert.equal(hits.length,1,'controls');
 enabled=false;event(map,'pointerdown',1);await wait(45);event(map,'pointerup',1);assert.equal(hits.length,1,'disabled selection mode');
 console.log('PASS: long press, tap, drag, multi-touch, cancel and controls');w.close();
})().catch(e=>{console.error(e);process.exitCode=1;w.close()});
