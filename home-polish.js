/* Progressive enhancement only. Core contact actions and map are static HTML. */
(() => {
  const instagramUrl='https://www.instagram.com/ercakirhukuk/';
  const facebookUrl='https://www.facebook.com/share/1ZRAvLbAjY/?mibextid=wwXIfr';
  const instagramIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle class="fill-dot" cx="17.4" cy="6.7" r="1.1"></circle></svg>';
  const facebookIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fb-fill" d="M13.7 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z"></path></svg>';
  document.querySelector('.office-map-compact')?.classList.add('map-card');
  const contactCopy=document.querySelector('.contact-copy');
  if(contactCopy&&!contactCopy.querySelector('.social-links')){
    const social=document.createElement('div');social.className='social-links';social.innerHTML=`<span>SOSYAL MEDYA</span><div><a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı">${instagramIcon}<span>Instagram</span><b>@ercakirhukuk</b></a><a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı">${facebookIcon}<span>Facebook</span><b>Erçakır Hukuk Bürosu</b></a></div>`;contactCopy.appendChild(social)
  }
  const footer=document.querySelector('footer');
  if(footer&&!footer.querySelector('.footer-social')){
    const footerSocial=document.createElement('div');footerSocial.className='footer-social';footerSocial.innerHTML=`<a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı" title="Instagram">${instagramIcon}</a><a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı" title="Facebook">${facebookIcon}</a>`;footer.appendChild(footerSocial)
  }

  const legalGrid=document.querySelector('#hukuki-icerikler-home .legal-content-grid');
  if(legalGrid){
    const whatsappCard=legalGrid.querySelector('a[href="whatsapp-yazismalari-delil-olur-mu.html"]')?.closest('.legal-content-card');
    whatsappCard?.querySelectorAll('.legal-content-cover > span, .legal-content-body > span').forEach(el=>{el.textContent='USUL HUKUKU'});

    const extraArticles=[
      ['trafik-kazasinda-tutanak-kusur-sigorta.html','SİGORTA HUKUKU · TRAFİK KAZALARI','Trafik Kazasında Tutanak, Kusur ve Sigorta','Kaza tespit tutanağı, kusur değerlendirmesi, tutanak yoksa ispat, sigorta başvurusu ve değer kaybı.'],
      ['6284-uzaklastirma-koruma-tedbirleri.html','AİLE HUKUKU · 6284','Uzaklaştırma ve Koruma Tedbirleri','Yaklaşmama, iletişim yasağı, koruyucu ve önleyici tedbirler, süre, itiraz ve tedbir ihlali.'],
      ['gaiplik-karari.html','KİŞİLER · AİLE · MİRAS HUKUKU','Gaiplik Kararı Nedir?','Uzun süre haber alınamama, ölüm tehlikesi, süreler, ilan, görevli mahkeme, miras ve evliliğin feshi.'],
      ['itirazin-iptali-davasi.html','İCRA VE İFLAS HUKUKU','İtirazın İptali Davası','Bir yıllık süre, icra takibinin devamı, ispat, icra inkar tazminatı ve arabuluculuk.'],
      ['menfi-tespit-davasi.html','İCRA VE İFLAS HUKUKU','Menfi Tespit Davası','Borçlu olmadığının tespiti, icra takibine etkisi, ihtiyati tedbir, teminat, istirdat ve arabuluculuk.'],
      ['is-kazasinda-isverenin-sorumlulugu.html','İŞ HUKUKU · İŞ KAZASI','İş Kazasında İşverenin Sorumluluğu','İş kazasının kapsamı, bildirim, iş sağlığı ve güvenliği yükümlülükleri, tazminat ve SGK hakları.'],
      ['tahliye-taahhutnamesi-gecerlilik-sartlari.html','KİRA HUKUKU','Tahliye Taahhütnamesi Ne Zaman Geçerlidir?','Geçerlilik şartları, teslimden sonra düzenleme, tahliye tarihi, bir aylık süre ve noter meselesi.'],
      ['kamulastirmasiz-el-atma-davasi.html','GAYRİMENKUL · İDARE HUKUKU','Kamulaştırmasız El Atma Davası','Fiili ve hukuki el atma, taşınmaz bedeli, ecrimisil, değerleme ve sorumlu idare.'],
      ['ortakligin-giderilmesi-davasi.html','GAYRİMENKUL · MİRAS HUKUKU','Ortaklığın Giderilmesi Davası','Aynen taksim, satış yoluyla paylaşım, dava şartı arabuluculuk ve paydaşların hukuki durumu.'],
      ['mirasciliktan-cikarma-mirastan-iskat.html','MİRAS HUKUKU','Mirasçılıktan Çıkarma (Mirastan Iskat)','Çıkarma sebepleri, ispat yükü, saklı paya ve altsoya etkisi.']
    ];
    const existing=new Set([...legalGrid.querySelectorAll('.legal-content-card a.legal-content-cover-link')].map(a=>a.getAttribute('href')));
    extraArticles.forEach(([href,category,title,description])=>{
      if(existing.has(href)) return;
      const article=document.createElement('article');
      article.className='legal-content-card';
      article.innerHTML=`<a class="legal-content-cover-link" href="${href}"><div class="legal-content-cover"><span>${category}</span><div class="cover-mark">ER</div><small>ERÇAKIR HUKUK BÜROSU</small></div></a><div class="legal-content-body"><span>${category}</span><h3><a class="legal-content-title-link" href="${href}">${title}</a></h3><p>${description}</p><a class="legal-content-read-link" href="${href}">İçeriği oku →</a></div>`;
      legalGrid.appendChild(article);
    });
  }
})();
