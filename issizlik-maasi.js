(function(){
'use strict';
/* 4447 sayılı Kanun m.50: günlük ödenek = son 4 ay prime esas kazanç ortalamasının %40'ı;
   aylık ödenek brüt asgari ücretin %80'ini geçemez; yalnızca damga vergisi kesilir.
   2026 brüt asgari ücret ve damga oranı: İŞKUR 2026 işsizlik ödeneği hesap tablosu. */
var BRUT_ASGARI = 33030.00, DAMGA = 0.00759, YIL = 2026;
var el = function(id){return document.getElementById(id)};
function money(x){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2,maximumFractionDigits:2}).format(x)}
function num(id){var s=String(el(id).value).trim().replace(',','.');if(s==='')return NaN;var v=parseFloat(s);return isFinite(v)?v:NaN}
function r2(x){return Math.round(x*100)/100}
function tiles(items){return '<div class="res-grid">'+items.map(function(t){return '<div class="res-item'+(t[2]?' res-main':'')+'"><span>'+t[0]+'</span><strong>'+t[1]+'</strong></div>'}).join('')+'</div>'}
el('issizBtn').addEventListener('click',function(e){
  e.preventDefault();
  var out=el('issizResult');
  var aylar=['ay1','ay2','ay3','ay4'].map(num);
  if(aylar.some(function(v){return !(v>0)})){out.innerHTML='Son dört ayın her biri için 0\'dan büyük brüt kazanç girin. Kazancınız her ay aynıysa aynı tutarı dört kutuya da yazın.';return}
  var gun=num('primGun');
  if(!(gun>=0)||Math.floor(gun)!==gun){out.innerHTML='Son üç yıldaki prim gün sayısını 0 veya daha büyük bir tam sayı olarak girin.';return}
  if(gun>1080){out.innerHTML='Son üç yılda en fazla 1.080 gün prim bildirilebilir (yılda 360 gün). Girdiğiniz '+gun+' gün bu sınırı aşıyor; SGK hizmet dökümünüzdeki son üç yıla ait gün sayısını kontrol edin.';return}
  if(el('neden').value==='hayir'){out.innerHTML='Seçtiğiniz ayrılma nedeni, 4447 sayılı Kanun\'un 51. maddesinde işsizlik ödeneğine hak kazandıran hâller arasında yer almıyor. Haklı bir neden olmadan istifa edenler ile ahlak ve iyiniyet kurallarına aykırı davranış nedeniyle işten çıkarılanlar ödenek alamaz.';return}
  if(el('son120').value!=='evet'){out.innerHTML='İşten ayrılmadan önceki son 120 gün hizmet akdine tabi olarak çalışmış olma şartı sağlanmıyor (4447 s.K. m.50). Bu şart olmadan ödenek bağlanmaz.';return}
  var sure=gun>=1080?300:gun>=900?240:gun>=600?180:0;
  if(!sure){out.innerHTML='Son üç yılda en az 600 gün işsizlik sigortası primi ödenmiş olması gerekir (4447 s.K. m.50). Girdiğiniz '+gun+' gün bu şartı karşılamıyor.';return}
  var ort=(aylar[0]+aylar[1]+aylar[2]+aylar[3])/4, tavan=r2(BRUT_ASGARI*0.8), hesap=r2(ort*0.4);
  var brut=Math.min(hesap,tavan), damga=r2(brut*DAMGA), net=r2(brut-damga), ay=sure/30;
  out.innerHTML=tiles([['Aylık net işsizlik maaşı',money(net),1],['Aylık brüt ödenek',money(brut)],['Damga vergisi (binde 7,59)',money(damga)],['Ödenek süresi',sure+' gün ('+ay+' ay)'],['Toplam net ödeme',money(r2(net*ay))],['Son 4 ay brüt ortalama',money(r2(ort))]])+
    (hesap>tavan?'<p class="note">Hesaplanan tutar ('+money(hesap)+') '+YIL+' yılı üst sınırını aştığı için ödenek '+money(tavan)+' brüt olarak bulunmuştur.</p>':'')+
    '<p class="note">'+YIL+' yılı brüt asgari ücreti ('+money(BRUT_ASGARI)+') esas alınmıştır. Kesin tutarı ve hak sahipliğini İŞKUR belirler.</p>';
});
})();
