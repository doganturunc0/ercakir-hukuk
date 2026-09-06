(()=>{
  const mapCard=document.querySelector('.map-card');
  if(mapCard){
    const openUrl=mapCard.getAttribute('href')||mapCard.querySelector('.map-overlay-link')?.getAttribute('href')||'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r%20Hukuk%20B%C3%BCrosu%20Salihli%20Manisa';

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

  const legalGrid=document.querySelector('#hukuki-icerikler-home .legal-content-grid');
  if(legalGrid && !legalGrid.querySelector('a[href="adli-kontrol-kararina-itiraz.html"]')){
    const card=document.createElement('article');
    card.className='legal-content-card';
    card.innerHTML='<a class="legal-content-cover-link" href="adli-kontrol-kararina-itiraz.html" aria-label="Adli Kontrol Kararına İtiraz ve Kaldırılması içeriğini aç"><div class="legal-content-cover"><span>CEZA MUHAKEMESİ</span><div class="cover-mark">ER</div><small>ERÇAKIR HUKUK BÜROSU</small></div></a><div class="legal-content-body"><span>CEZA HUKUKU</span><h3><a class="legal-content-title-link" href="adli-kontrol-kararina-itiraz.html">Adli Kontrol Kararına İtiraz ve Kaldırılması</a></h3><p>Adli kontrolün koşulları, yükümlülüklerin değiştirilmesi veya kaldırılması, itiraz yolu ve sürelerin genel çerçevesi.</p><a class="legal-content-read-link" href="adli-kontrol-kararina-itiraz.html">İçeriği oku →</a></div>';
    legalGrid.appendChild(card);
  }

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
