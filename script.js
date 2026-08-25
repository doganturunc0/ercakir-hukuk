const fmt=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(n||0);
const daysBetween=(a,b)=>Math.max(0,Math.floor((b-a)/86400000));
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('pageLoader')?.classList.add('hide'),280));

const header=document.getElementById('siteHeader');
const menuBtn=document.getElementById('menuBtn');
menuBtn?.addEventListener('click',()=>header?.classList.toggle('menu-open'));

const nav=document.getElementById('mainNav');
if(nav){
  nav.innerHTML='<a href="#hakkimizda">Av. Büşra Turunç</a><a href="#alanlar">Faaliyet Alanları</a><a href="#hesaplamalar">Hesaplama Araçları</a><a href="#makaleler">Hukuki Bilgilendirmeler</a><a href="#iletisim">İletişim</a>';
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>header?.classList.remove('menu-open')));
}
const map=document.querySelector('.header-map');if(map)map.textContent='Konum';

document.querySelector('.hero-meta')?.remove();
const hero=document.querySelector('.hero-panel');
if(hero){
  const eyebrow=hero.querySelector('.eyebrow');
  const h=hero.querySelector('h1');
  const lead=hero.querySelector('p:not(.eyebrow)');
  if(eyebrow)eyebrow.textContent='ERÇAKIR HUKUK BÜROSU · SALİHLİ / MANİSA';
  if(h)h.textContent='Hukuki süreçlerde açık ve sistemli yaklaşım.';
  if(lead)lead.textContent='Uyuşmazlığın hukuki çerçevesi, mevcut deliller ve izlenecek usul birlikte değerlendirilerek süreç hakkında anlaşılır bir yol haritası oluşturulur.';
}

const intro=document.getElementById('hakkimizda');
if(intro){
  intro.querySelector('.intro-kicker')?.remove();
  const e=intro.querySelector('.eyebrow'),h=intro.querySelector('h2'),p=intro.querySelector('.intro-copy p');
  if(e)e.textContent='AVUKAT';
  if(h)h.textContent='Av. Büşra Turunç';
  if(p)p.textContent='Hukuki uyuşmazlıklar; olayın özellikleri, dosya kapsamı, deliller, uygulanacak mevzuat ve yargısal süreç birlikte değerlendirilerek ele alınır.';
}

const practice=document.getElementById('alanlar');
if(practice){const e=practice.querySelector('.section-heading .eyebrow'),h=practice.querySelector('.section-heading h2'),p=practice.querySelector('.section-heading>p:last-child');if(e)e.textContent='ÇALIŞMA ALANLARI';if(h)h.textContent='Faaliyet Alanları';if(p)p.textContent='Her hukuki uyuşmazlık kendi olay ve delil yapısı içinde değerlendirilir.';}
const calc=document.getElementById('hesaplamalar');
if(calc){const e=calc.querySelector('.section-heading .eyebrow'),h=calc.querySelector('.section-heading h2'),p=calc.querySelector('.section-heading>p:last-child');if(e)e.textContent='ARAÇLAR';if(h)h.textContent='Hukuki Hesaplama Araçları';if(p)p.textContent='Genel bilgi amacıyla hazırlanan hesaplama araçları, somut dosyaya ilişkin hukuki değerlendirme yerine geçmez.';}
const articles=document.getElementById('makaleler');
if(articles){const e=articles.querySelector('.section-heading .eyebrow'),h=articles.querySelector('.section-heading h2'),p=articles.querySelector('.section-heading>p:last-child');if(e)e.textContent='BİLGİ NOTLARI';if(h)h.textContent='Hukuki Bilgilendirmeler';if(p)p.textContent='Mevzuat ve uygulamada sık karşılaşılan konulara ilişkin genel nitelikte açıklamalar.';}

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.calc-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.calc-tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');document.getElementById(btn.dataset.tab)?.classList.add('active');
}));

function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}
function closeModals(){document.querySelectorAll('.modal.open').forEach(m=>{m.classList.remove('open');m.setAttribute('aria-hidden','true')});document.body.classList.remove('modal-open')}
document.querySelectorAll('[data-modal-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modalOpen)));
document.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',closeModals));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});

function calcKidem(){const s=new Date(kidemStart.value),e=new Date(kidemEnd.value),salary=+kidemSalary.value,cap=+kidemCap.value||Infinity;if(!kidemStart.value||!kidemEnd.value||!salary||e<=s)return kidemResult.textContent='Geçerli tarih ve ücret bilgisi girin.';const days=daysBetween(s,e),base=Math.min(salary,cap),gross=base*days/365;kidemResult.innerHTML=`Çalışma süresi: <b>${days} gün</b><br>Hesaba esas aylık ücret: <b>${fmt(base)}</b><br>Tahmini brüt kıdem tazminatı: <b>${fmt(gross)}</b>`}
function calcIhbar(){const m=+ihbarMonths.value,s=+ihbarSalary.value;if(m<0||!s)return ihbarResult.textContent='Geçerli çalışma süresi ve ücret girin.';const weeks=m<6?2:m<18?4:m<36?6:8,gross=s/30*(weeks*7);ihbarResult.innerHTML=`Bildirim süresi: <b>${weeks} hafta</b><br>Tahmini brüt ihbar tazminatı: <b>${fmt(gross)}</b>`}
function calcMesai(){const s=+mesaiSalary.value,h=+mesaiHours.value;if(!s||h<0)return mesaiResult.textContent='Geçerli ücret ve saat girin.';const hourly=s/225,overtime=hourly*1.5*h;mesaiResult.innerHTML=`Normal saatlik ücret: <b>${fmt(hourly)}</b><br>%50 zamlı saatlik ücret: <b>${fmt(hourly*1.5)}</b><br>Tahmini brüt fazla çalışma: <b>${fmt(overtime)}</b>`}
function calcIzin(){const s=+izinSalary.value,d=+izinDays.value;if(!s||d<0)return izinResult.textContent='Geçerli ücret ve gün girin.';const daily=s/30;izinResult.innerHTML=`Günlük brüt ücret: <b>${fmt(daily)}</b><br>Tahmini brüt yıllık izin ücreti: <b>${fmt(daily*d)}</b>`}
function calcFaiz(){const p=+faizPrincipal.value,r=+faizRate.value,s=new Date(faizStart.value),e=new Date(faizEnd.value);if(!p||!r||!faizStart.value||!faizEnd.value||e<s)return faizResult.textContent='Geçerli ana para, oran ve tarih girin.';const d=daysBetween(s,e),interest=p*(r/100)*(d/365);faizResult.innerHTML=`Süre: <b>${d} gün</b><br>Faiz tutarı: <b>${fmt(interest)}</b><br>Ana para + faiz: <b>${fmt(p+interest)}</b>`}

(()=>{
 const calc=document.getElementById('hesaplamalar');if(!calc||document.getElementById('infazFeature'))return;
 const feature=document.createElement('section');feature.className='infaz-feature';feature.id='infazFeature';feature.innerHTML='<div class="infaz-feature-inner"><div><p class="eyebrow">HESAPLAMA ARACI</p><h2>İnfaz Hesaplama</h2><p>Ceza miktarı, suç tarihi, mahsup ve infaz rejimine ilişkin bilgiler üzerinden genel nitelikte ön hesaplama yapılabilir.</p></div><button class="infaz-launch" type="button">Hesaplamayı Aç</button></div>';
 calc.parentNode.insertBefore(feature,calc);
 const overlay=document.createElement('div');overlay.className='infaz-overlay';overlay.innerHTML='<div class="infaz-window"><button class="infaz-window-close" type="button" aria-label="Kapat">×</button><iframe title="İnfaz Hesaplama" data-src="infaz-hesaplama.html"></iframe></div>';document.body.appendChild(overlay);
 feature.querySelector('button').onclick=()=>{const f=overlay.querySelector('iframe');if(!f.src)f.src=f.dataset.src;overlay.classList.add('open')};
 overlay.querySelector('button').onclick=()=>overlay.classList.remove('open');
 overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});
})();