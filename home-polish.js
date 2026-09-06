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

  document.querySelectorAll('a.legal-content-cover-link').forEach(link=>{
    const cover=document.createElement('div');
    cover.className=link.className;
    cover.innerHTML=link.innerHTML;
    link.replaceWith(cover);
  });

  const footer=document.querySelector('footer');
  if(footer && !footer.querySelector('[data-legal-footer]')){
    const legal=document.createElement('p');
    legal.setAttribute('data-legal-footer','');
    legal.innerHTML='<a href="hakkimizda.html">Hakkımızda</a> · <a href="iletisim.html">İletişim</a> · <a href="kvkk-aydinlatma-metni.html">KVKK Aydınlatma Metni</a> · <a href="gizlilik-cerez-politikasi.html">Gizlilik ve Çerez Politikası</a>';
    footer.appendChild(legal);
  }
})();
