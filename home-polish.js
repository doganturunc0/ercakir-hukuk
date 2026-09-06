(()=>{
  const mapCard=document.querySelector('.map-card');
  if(mapCard){
    const openUrl=mapCard.getAttribute('href')||mapCard.querySelector('.map-overlay-link')?.getAttribute('href')||'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r%20Hukuk%20B%C3%BCrosu%20Salihli%20Manisa';
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

  const legalGrid=document.querySelector('#hukuki-icerikler-home .legal-content-grid');
  const addLegalCard=(href,coverLabel,bodyLabel,title,summary)=>{
    if(!legalGrid || legalGrid.querySelector('a[href="'+href+'"]')) return;
    const card=document.createElement('article');
    card.className='legal-content-card';
    card.innerHTML='<a class="legal-content-cover-link" href="'+href+'" aria-label="'+title+' içeriğini aç"><div class="legal-content-cover"><span>'+coverLabel+'</span><div class="cover-mark">ER</div><small>ERÇAKIR HUKUK BÜROSU</small></div></a><div class="legal-content-body"><span>'+bodyLabel+'</span><h3><a class="legal-content-title-link" href="'+href+'">'+title+'</a></h3><p>'+summary+'</p><a class="legal-content-read-link" href="'+href+'">İçeriği oku →</a></div>';
    legalGrid.appendChild(card);
  };
  addLegalCard('adli-kontrol-kararina-itiraz.html','CEZA MUHAKEMESİ','CEZA HUKUKU','Adli Kontrol Kararına İtiraz ve Kaldırılması','Adli kontrolün koşulları, yükümlülüklerin değiştirilmesi veya kaldırılması, itiraz yolu ve sürelerin genel çerçevesi.');
  addLegalCard('cekismeli-bosanma-davasi.html','AİLE HUKUKU','BOŞANMA HUKUKU','Çekişmeli Boşanma Davası','Süreç, hukuka uygun deliller, geçici önlemler, velayet, nafaka ve tazminat taleplerinin genel çerçevesi.');
  addLegalCard('velayet-davasi-velayetin-degistirilmesi.html','AİLE HUKUKU','VELAYET','Velayet Davası ve Velayetin Değiştirilmesi','Çocuğun üstün yararı, velayetin belirlenmesi ve değişen koşullarda velayet düzeninin değiştirilmesinin genel çerçevesi.');

  /* GEO/LLM readability: keep existing semantic links and footer markup untouched.
     Avoid replacing valid server-rendered anchors or appending duplicate footer nodes at runtime. */
})();
