(function(root){
 'use strict';
 const R=6371000,RAD=Math.PI/180;
 function segmentLength(a,b){const y1=a[1]*RAD,y2=b[1]*RAD,dy=y2-y1,dx=(b[0]-a[0])*RAD;const h=Math.sin(dy/2)**2+Math.cos(y1)*Math.cos(y2)*Math.sin(dx/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(h)));}
 function projection(p,a,b){const scale=R*RAD,cos=Math.cos(p.latitude*RAD);const ax=(a[0]-p.longitude)*scale*cos,ay=(a[1]-p.latitude)*scale,bx=(b[0]-p.longitude)*scale*cos,by=(b[1]-p.latitude)*scale;const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;const t=den?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den)):0;return {distance:Math.hypot(ax+t*dx,ay+t*dy),fraction:t};}
 function createTracker(steps,totalDistance,totalDuration){
  if(!Array.isArray(steps)||!Number.isFinite(totalDistance)||!Number.isFinite(totalDuration))return null;
  const parts=[];let beforeDistance=0,beforeDuration=0;
  steps.forEach((step,index)=>{const points=step.geometry?.coordinates||[];const lengths=[];let length=0;for(let i=1;i<points.length;i++){const d=segmentLength(points[i-1],points[i]);lengths.push(d);length+=d;}const distance=Math.max(0,Number(step.distance)||0),duration=Math.max(0,Number(step.duration)||0);if(length>0){let consumed=0;lengths.forEach((lengthPart,i)=>{parts.push({a:points[i],b:points[i+1],stepIndex:index,stepDistance:distance,stepDuration:duration,beforeDistance,beforeDuration,fractionStart:consumed/length,fractionSize:lengthPart/length});consumed+=lengthPart;});}beforeDistance+=distance;beforeDuration+=duration;});
  if(!parts.length)return null;let previous=null;
  function update(coords,time){
   if(!coords||!Number.isFinite(coords.latitude)||!Number.isFinite(coords.longitude)||!Number.isFinite(coords.accuracy)||coords.accuracy>50)return null;
   const now=Number.isFinite(time)?time:Date.now(),elapsed=previous?Math.max(0,(now-previous.time)/1000):0;const allowedAhead=previous?Math.max(200,Math.min(3000,100+elapsed*40)):1000;let best=null;
   for(const seg of parts){const p=projection(coords,seg.a,seg.b);const frac=seg.fractionStart+seg.fractionSize*p.fraction;const done=seg.beforeDistance+seg.stepDistance*frac;if(previous&&(done<previous.distance-40||done>previous.distance+allowedAhead))continue;if(!previous&&done>allowedAhead)continue;const score=p.distance+(previous&&done<previous.distance?Math.min(30,(previous.distance-done)*.3):0);if(!best||score<best.score)best={score,distanceFromRoute:p.distance,progress:done,fraction:frac,segment:seg};}
   if(!best)return null;const maxMatch=Math.max(35,Math.min(80,coords.accuracy*1.5));const match=best.distanceFromRoute<=maxMatch;const segment=best.segment;let result={matched:match,distanceFromRoute:best.distanceFromRoute,stepIndex:segment.stepIndex,distanceToNext:Math.max(0,segment.stepDistance*(1-best.fraction)),remainingDistance:Math.max(0,totalDistance-best.progress),remainingDuration:Math.max(0,totalDuration-(segment.beforeDuration+segment.stepDuration*best.fraction))};if(match){if(previous&&best.progress<previous.distance)result={...previous.result,distanceFromRoute:best.distanceFromRoute};else previous={distance:best.progress,time:now,result};}return result;
  }
  return {update};
 }
 function buildingKey(value){const s=String(value||'').split(',')[0].toLocaleLowerCase('lt-LT').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s/-]/g,'').trim();if(!/\d+[a-z]?(?:[-/]\d+[a-z]?)?$/.test(s))return '';return s.replace(/[^a-z0-9]/g,'');}
 function sameBuilding(a,b){const first=buildingKey(a),second=buildingKey(b);return !!first&&first===second;}
 if(typeof module!=='undefined'&&module.exports)module.exports={createTracker,sameBuilding};else root.KelrodisNavigation={createTracker,sameBuilding};
})(typeof window!=='undefined'?window:globalThis);
