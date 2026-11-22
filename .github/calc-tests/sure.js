// Hukuki süre aracı: beklenen son günler sure-cases.py ile (HMK m.92-93, 104; CMK m.331; İYUK m.8) ayrıca hesaplanmıştır.
// Kullanım: BASE=http://127.0.0.1:8000/ node .github/calc-tests/sure.js
const {chromium}=require('playwright');const path=require('path');const C=require(path.join(__dirname,'sure-cases.json'));const BASE=process.env.BASE||'http://127.0.0.1:8000/';
const AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto(BASE+'sure-hesaplama.html');let ok=0;
for(const c of C){const t=await p.evaluate(c=>{const s=document.getElementById('shIslem');s.value=c.op;s.dispatchEvent(new Event('change'));const k=document.getElementById('shTatilDisi');if(k)k.checked=c.tatilde;document.getElementById('shTarih').value=c.t;document.getElementById('shBtn').click();return document.getElementById('shSonuc').innerText.replace(/\s+/g,' ')},c);
 const [y,m,d]=c.exp.split('-').map(Number);const want=`Son gün: ${d} ${AY[m-1]} ${y}`;const pass=t.includes(want);if(pass)ok++;
 console.log((pass?'DOĞRU ':'FARK  ')+`${c.op} tebliğ ${c.t}${c.tatilde?' (tatilde görülen iş)':''} → beklenen ${want.slice(9)}`+(pass?'':' | gelen: '+t.slice(0,140)))}
// Takvim kapsamı: aralık dışı tebliğ tarihi sonuç üretmemeli; 2028'e düşen son gün "ön hesap" olarak gösterilmeli.
const run=(op,t)=>p.evaluate(([op,t])=>{const s=document.getElementById('shIslem');s.value=op;s.dispatchEvent(new Event('change'));document.getElementById('shTarih').value=t;document.getElementById('shBtn').click();return document.getElementById('shSonuc').innerText.replace(/\s+/g,' ')},[op,t]);
const K=[['cevap','2028-01-03',t=>!t.includes('Son gün')&&t.includes('arasında')],['cevap','2025-11-20',t=>!t.includes('Son gün')&&t.includes('arasında')],['cevap','2027-12-28',t=>t.includes('Son gün (ön hesap):')],['cevap','2027-12-01',t=>t.includes('Son gün:')&&!t.includes('ön hesap')]];
let kok=0;for(const [op,t,f] of K){const r=await run(op,t);const pass=f(r);if(pass)kok++;console.log((pass?'DOĞRU ':'FARK  ')+`kapsam ${op} ${t}`+(pass?'':' | gelen: '+r.slice(0,140)))}
const T=C.length+K.length;ok+=kok;
console.log(`SÜRE ${ok}/${T}`);await b.close();process.exit(ok===T?0:1)})();
