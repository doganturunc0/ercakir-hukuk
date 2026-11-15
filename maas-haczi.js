(function(){
'use strict';
/* İİK m.83: maaşın haczedilecek kısmı dörtte birden az olamaz; birden fazla haciz sıraya konur,
   öndeki haczin kesintisi bitmeden sonrakine geçilmez. 5510 s.K. m.93: SGK aylıkları; SGK alacakları
   ve nafaka borçları dışında, borçlunun muvafakati olmadıkça haczedilemez. */
var el=function(id){return document.getElementById(id)};
function money(x){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2,maximumFractionDigits:2}).format(x)}
function num(id){var s=String(el(id).value).trim().replace(',','.');if(s==='')return NaN;var v=parseFloat(s);return isFinite(v)?v:NaN}
function r2(x){return Math.round(x*100)/100}
function tiles(items){return '<div class="res-grid">'+items.map(function(t){return '<div class="res-item'+(t[2]?' res-main':'')+'"><span>'+t[0]+'</span><strong>'+t[1]+'</strong></div>'}).join('')+'</div>'}
function ay(n){return n+' ay'}
function sync(){el('emekliWrap').hidden=el('tur').value!=='emekli'}
el('tur').addEventListener('change',sync);sync();
el('hacizBtn').addEventListener('click',function(e){
  e.preventDefault();
  var out=el('hacizResult');
  var maas=num('maas'),oran=num('oran'),borc=num('borc'),onceki=String(el('onceki').value).trim()===''?0:num('onceki');
  if(!(maas>0)){out.innerHTML='Aylık maaş tutarını 0\'dan büyük bir sayı olarak girin.';return}
  if(!(oran>=25&&oran<=100)){out.innerHTML='Kesinti oranı yüzde 25\'ten az olamaz (İİK m.83); 25 ile 100 arasında bir oran girin.';return}
  if(!(borc>0)){out.innerHTML='Bu icra dosyasının borç tutarını 0\'dan büyük bir sayı olarak girin.';return}
  if(!(onceki>=0)){out.innerHTML='Sırada öndeki hacizlerin kalan borcu 0 veya daha büyük olmalıdır; yoksa boş bırakın.';return}
  if(el('tur').value==='emekli'&&el('emekliNeden').value==='diger'){out.innerHTML='SGK\'dan bağlanan emekli aylığı; SGK alacakları ve nafaka borçları dışında haczedilemez. Borçlunun muvafakati (yazılı onayı) yoksa haciz talebi icra müdürü tarafından reddedilir (5510 s.K. m.93).';return}
  var kesinti=r2(maas*oran/100),bekleme=onceki>0?Math.ceil(onceki/kesinti):0,sure=Math.ceil(borc/kesinti);
  var son=r2(borc-kesinti*(sure-1));
  out.innerHTML=tiles([['Aylık kesinti',money(kesinti),1],['Maaştan kalan',money(r2(maas-kesinti))],['Öndeki hacizler için bekleme',bekleme?ay(bekleme)+' (yaklaşık)':'Yok'],['Bu dosyanın kesinti süresi',ay(sure)+' (yaklaşık)'],['Son ay kesintisi',money(son)],['Toplam süre',ay(bekleme+sure)+' (yaklaşık)']])+
    '<p class="note">Süreler, borcun sabit kaldığı varsayımıyla bulunmuştur. Dosyada faiz ve masraflar işlemeye devam ettiği için gerçek süre daha uzun olabilir; kesinti oranını icra müdürü belirler.</p>';
});
})();
