(function(){
'use strict';
/* TMK m.176, m.182, m.330: hâkim, istem hâlinde nafakanın gelecek yıllarda ne miktarda ödeneceğini
   karara bağlayabilir. Araç, karardaki endeksin (ör. TÜFE/ÜFE) yıllık değişim oranını kullanıcıdan alır. */
var el=function(id){return document.getElementById(id)};
function money(x){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2,maximumFractionDigits:2}).format(x)}
function num(id){var s=String(el(id).value).trim().replace(',','.');if(s==='')return NaN;var v=parseFloat(s);return isFinite(v)?v:NaN}
function r2(x){return Math.round(x*100)/100}
function pct(x){return '%'+x.toLocaleString('tr-TR',{maximumFractionDigits:2})}
function tiles(items){return '<div class="res-grid">'+items.map(function(t){return '<div class="res-item'+(t[2]?' res-main':'')+'"><span>'+t[0]+'</span><strong>'+t[1]+'</strong></div>'}).join('')+'</div>'}
el('nafakaBtn').addEventListener('click',function(e){
  e.preventDefault();
  var out=el('nafakaResult');
  var n=num('nafaka'),o=num('oran'),aySrc=String(el('ay').value).trim(),ay=aySrc===''?0:num('ay');
  if(!(n>0)){out.innerHTML='Mevcut aylık nafaka tutarını 0\'dan büyük bir sayı olarak girin.';return}
  if(!(o>=0)){out.innerHTML='Artış oranını 0 veya daha büyük bir sayı olarak girin (örneğin karardaki endeksin yıllık değişim oranı).';return}
  if(!(ay>=0)||Math.floor(ay)!==ay){out.innerHTML='Fark hesaplanacak ay sayısını 0 veya daha büyük bir tam sayı olarak girin; gerekmiyorsa boş bırakın.';return}
  var yeni=r2(n*(1+o/100)),fark=r2(yeni-n);
  var items=[['Yeni aylık nafaka',money(yeni),1],['Aylık artış',money(fark)],['Uygulanan oran',pct(o)],['Yıllık toplam fark',money(r2(fark*12))]];
  if(ay>0)items.push(['Ödenmeyen artış farkı ('+ay+' ay)',money(r2(fark*ay))]);
  out.innerHTML=tiles(items)+'<p class="note">Artış ancak kararda yıllık artışa hükmedilmişse kendiliğinden uygulanır. Kararda böyle bir hüküm yoksa nafakanın artırılması için dava açılması gerekir.</p>';
});
})();
