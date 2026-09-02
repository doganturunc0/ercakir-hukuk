(()=>{
  const mapCard=document.querySelector('.map-card');
  if(mapCard&&!mapCard.querySelector('.office-map-frame')){
    const mapsUrl='https://www.google.com/maps?q=Er%C3%A7ak%C4%B1r%20Hukuk%20B%C3%BCrosu%20Salihli%20Manisa&output=embed';
    const openUrl=mapCard.getAttribute('href')||'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r+Hukuk+B%C3%BCrosu+Salihli+Manisa';
    mapCard.removeAttribute('target');
    mapCard.removeAttribute('href');
    mapCard.innerHTML='<iframe class="office-map-frame" title="Erçakır Hukuk Bürosu harita konumu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+mapsUrl+'"></iframe><a class="map-overlay-link" href="'+openUrl+'" target="_blank" rel="noopener noreferrer">Google Maps’te Aç ↗</a>';
  }

  document.querySelectorAll('#hukuki-icerikler-home a.legal-content-card[href]').forEach((oldCard)=>{
    const href=oldCard.getAttribute('href');
    if(!href||href==='#') return;

    const card=document.createElement('article');
    card.className='legal-content-card';
    card.setAttribute('data-content-url',href);
    card.innerHTML=oldCard.innerHTML;

    const cover=card.querySelector('.legal-content-cover');
    if(cover){
      const coverLink=document.createElement('a');
      coverLink.className='legal-content-cover-link';
      coverLink.href=href;
      coverLink.setAttribute('aria-label',oldCard.getAttribute('aria-label')||'Hukuki içeriği aç');
      cover.replaceWith(coverLink);
      coverLink.appendChild(cover);
    }

    const title=card.querySelector('.legal-content-body h3');
    if(title){
      const titleText=title.textContent.trim();
      title.textContent='';
      const titleLink=document.createElement('a');
      titleLink.className='legal-content-title-link';
      titleLink.href=href;
      titleLink.textContent=titleText;
      title.appendChild(titleLink);
    }

    const read=card.querySelector('.legal-content-body b');
    if(read){
      const readLink=document.createElement('a');
      readLink.className='legal-content-read-link';
      readLink.href=href;
      readLink.textContent=read.textContent.trim()||'İçeriği oku →';
      read.replaceWith(readLink);
    }

    oldCard.replaceWith(card);
  });
})();
