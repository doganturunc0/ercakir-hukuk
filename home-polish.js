(()=>{
  const mapCard=document.querySelector('.map-card');
  if(mapCard){
    const openUrl=mapCard.getAttribute('href')||mapCard.querySelector('.map-overlay-link')?.getAttribute('href')||'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r+Hukuk+B%C3%BCrosu+Salihli+Manisa';

    // Privacy-first map card: do not embed Google Maps or contact a
    // third-party map service until the visitor explicitly clicks.
    const replacement=document.createElement('a');
    replacement.className=mapCard.className;
    replacement.href=openUrl;
    replacement.target='_blank';
    replacement.rel='noopener noreferrer';
    replacement.setAttribute('title','Google Maps üzerinde Erçakır Hukuk Bürosu konumunu aç');
    replacement.setAttribute('aria-label','Google Maps üzerinde Erçakır Hukuk Bürosu konumunu aç');
    replacement.innerHTML='<span class="map-overlay-link">Google Maps’te Konumu Aç ↗</span>';

    mapCard.replaceWith(replacement);
  }

  document.querySelectorAll('a.legal-content-cover-link').forEach(link=>{
    const cover=document.createElement('div');
    cover.className=link.className;
    cover.innerHTML=link.innerHTML;
    link.replaceWith(cover);
  });
})();
