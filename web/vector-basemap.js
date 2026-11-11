/* Vector basemap is optional: Leaflet raster tiles remain visible until it is ready. */
(function(root){
 'use strict';
 function attach(map,raster){
  const node=document.getElementById('vectorMap');if(!node)return;
  let vector=null,ready=false,frame=null,failed=false;map._vectorBasemapState='loading';
  function sync(){frame=null;if(!vector||failed)return;try{const c=map.getCenter();vector.jumpTo({center:[c.lng,c.lat],zoom:Math.max(0,map.getZoom()-1),bearing:-(map.getBearing?.()||0),pitch:0});}catch(e){fallback();}}
  function queue(){if(frame===null)frame=requestAnimationFrame(sync);}
  function fallback(){if(failed)return;failed=true;map._vectorBasemapState='unavailable';node.classList.remove('ready');if(!map.hasLayer(raster))raster.addTo(map);if(vector){try{vector.remove();}catch{}vector=null;}map._vectorBasemapReady=false;}
  function init(){
   try{
    if(!root.maplibregl||typeof root.maplibregl.Map!=='function'){fallback();return;}
    const c=map.getCenter();vector=new root.maplibregl.Map({container:node,style:'https://tiles.openfreemap.org/styles/liberty',center:[c.lng,c.lat],zoom:Math.max(0,map.getZoom()-1),bearing:-(map.getBearing?.()||0),interactive:false,attributionControl:false,fadeDuration:0});
    vector.on('load',()=>{
      try{
       for(const layer of vector.getStyle().layers){if(layer.type==='symbol'&&layer.layout?.['text-field']){if(layer.layout['text-keep-upright']!==undefined)vector.setLayoutProperty(layer.id,'text-keep-upright',null);vector.setLayoutProperty(layer.id,'text-rotation-alignment','viewport');}}
       if(vector.getSource('openmaptiles'))vector.addLayer({id:'kelrodis-housenumbers',type:'symbol',source:'openmaptiles','source-layer':'housenumber',minzoom:14,layout:{'text-field':['get','housenumber'],'text-font':['Noto Sans Regular'],'text-size':11,'text-rotation-alignment':'viewport'},paint:{'text-color':'#685c4f','text-halo-color':'#f2eee6','text-halo-width':1}});
       vector.getCanvas().addEventListener('webglcontextlost',fallback,{once:true});queue();
      }catch(e){fallback();}
    });
    vector.on('idle',()=>{if(!vector||failed||ready)return;ready=true;map._vectorBasemapState='ready';node.classList.add('ready');map._vectorBasemapReady=true;map.attributionControl?.addAttribution('<a href="https://openfreemap.org">OpenFreeMap</a> · © <a href="https://openmaptiles.org">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kūrėjai');if(map.hasLayer(raster))map.removeLayer(raster);});
    map.on('move zoom rotate',queue);map.on('resize',()=>{if(vector&&!failed){vector.resize();queue();}});
   }catch(e){fallback();}
  }
  const script=document.createElement('script');script.src='/maplibre-gl.js?v=4';script.async=true;script.onload=init;script.onerror=fallback;document.head.appendChild(script);setTimeout(()=>{if(!ready)fallback();},20000);
 }
 root.KelrodisVector={attach};
})(window);
