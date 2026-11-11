(function(root){
  'use strict';
  function createAnimator(options){
    let current=null, frame=null, generation=0;
    const copy=p=>({latitude:p.latitude,longitude:p.longitude});
    function update(target,duration){
      if(!target || !Number.isFinite(target.latitude) || !Number.isFinite(target.longitude)) return;
      generation++;
      if(frame!==null){options.cancelFrame(frame);frame=null;}
      const end=copy(target),ms=Math.max(0,Number(duration)||0);
      if(!current||ms===0){current=end;options.setPosition(copy(current));return;}
      const start=copy(current),begin=options.now(),id=generation;
      function step(time){
        if(id!==generation)return;
        const t=Math.max(0,Math.min(1,(time-begin)/ms));
        current={latitude:start.latitude+(end.latitude-start.latitude)*t,longitude:start.longitude+(end.longitude-start.longitude)*t};
        options.setPosition(copy(current));
        if(t<1)frame=options.requestFrame(step);else frame=null;
      }
      frame=options.requestFrame(step);
    }
    function cancel(){generation++;if(frame!==null)options.cancelFrame(frame);frame=null;}
    return {update,cancel};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={createAnimator};
  else root.KelrodisMotion={createAnimator};
})(typeof window!=='undefined'?window:globalThis);
