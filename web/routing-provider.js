(() => {
  function routeUrl(coordinates, token) {
    if (typeof token === 'string' && token.startsWith('pk.')) {
      const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordinates}`);
      url.search = new URLSearchParams({overview:'full',alternatives:'true',geometries:'geojson',steps:'true',language:'lt',access_token:token});
      return url.toString();
    }
    return `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&alternatives=3&geometries=geojson&steps=true`;
  }
  window.KelrodisRoutingProvider = {routeUrl};
})();
