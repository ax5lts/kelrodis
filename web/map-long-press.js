(() => {
  function attach({element, onHold, isEnabled = () => true, delay = 650, tolerance = 12}) {
    let timer = null, start = null;
    const pointers = new Set();
    const cancel = () => { clearTimeout(timer); timer = null; start = null; };
    const blocked = target => target?.closest?.('.leaflet-marker-icon, .leaflet-control, .leaflet-interactive, button, a');
    const begin = (x, y, target) => {
      cancel();
      if (!isEnabled() || blocked(target)) return;
      start = {x, y};
      timer = setTimeout(() => { const point = start; cancel(); if (point && isEnabled()) onHold(point); }, delay);
    };
    const move = (x, y) => { if (start && Math.hypot(x - start.x, y - start.y) > tolerance) cancel(); };
    element.addEventListener('contextmenu', e => e.preventDefault());
    if ('PointerEvent' in window) {
      element.addEventListener('pointerdown', e => {
        pointers.add(e.pointerId);
        if (pointers.size !== 1 || e.isPrimary === false || (e.button !== undefined && e.button !== 0)) { cancel(); return; }
        begin(e.clientX, e.clientY, e.target);
      });
      window.addEventListener('pointermove', e => { if (pointers.has(e.pointerId)) move(e.clientX, e.clientY); });
      const end = e => { pointers.delete(e.pointerId); cancel(); };
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    } else {
      element.addEventListener('touchstart', e => {
        if (e.touches.length !== 1) { cancel(); return; }
        const t = e.touches[0]; begin(t.clientX, t.clientY, e.target);
      }, {passive:true});
      window.addEventListener('touchmove', e => { if (e.touches.length !== 1) cancel(); else move(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
      window.addEventListener('touchend', cancel);
      window.addEventListener('touchcancel', cancel);
      element.addEventListener('mousedown', e => { if (e.button === 0) begin(e.clientX, e.clientY, e.target); });
      window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
      window.addEventListener('mouseup', cancel);
    }
    window.addEventListener('blur', () => { pointers.clear(); cancel(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { pointers.clear(); cancel(); } });
  }
  window.KelrodisLongPress = {attach};
})();
