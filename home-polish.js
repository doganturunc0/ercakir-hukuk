(()=>{
  const mapCard=document.querySelector('.map-card');
  if(mapCard&&!mapCard.querySelector('.office-map-frame')){
    const mapsUrl='https://www.google.com/maps?q=Er%C3%A7ak%C4%B1r%20Hukuk%20B%C3%BCrosu%20Salihli%20Manisa&output=embed';
    const openUrl=mapCard.getAttribute('href')||'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r+Hukuk+B%C3%BCrosu+Salihli+Manisa';
    mapCard.removeAttribute('target');
    mapCard.removeAttribute('href');
    mapCard.innerHTML='<iframe class="office-map-frame" title="Erçakır Hukuk Bürosu harita konumu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+mapsUrl+'"></iframe><a class="map-overlay-link" href="'+openUrl+'" target="_blank" rel="noopener noreferrer">Google Maps’te Aç ↗</a>';
  }
})();
