import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
const files=['index.html','style.css','app.js','manifest.webmanifest','sw.js','icon-192.png','icon-512.png','leaflet.js','leaflet.css','leaflet-rotate.js','position-motion.js','navigation-engine.js','maplibre-gl.js','maplibre-gl.css','vector-basemap.js'];
const assets={};
for(const name of files) assets['/'+name]=(await readFile('public/'+name)).toString('base64');
const worker=await readFile('worker/index.js','utf8');
await mkdir('dist/server',{recursive:true}); await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',`const ASSETS = ${JSON.stringify(assets)};\n`+worker);
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Worker built with',files.length,'assets');
