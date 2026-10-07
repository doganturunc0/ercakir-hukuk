(function(){
'use strict';
var el=function(id){return document.getElementById(id)};
function money(x){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(x)}
function num(id){var v=parseFloat(String(el(id).value).replace(',','.'));return isFinite(v)?v:NaN}
function p(x){return '%'+x.toLocaleString('tr-TR',{maximumFractionDigits:2})}
function tiles(items){return '<div class="res-grid">'+items.map(function(t){return '<div class="res-item'+(t[2]?' res-main':'')+'"><span>'+t[0]+'</span><strong>'+t[1]+'</strong></div>'}).join('')+'</div>'}
el('kiraBtn').addEventListener('click',function(e){
  e.preventDefault();
  var kira=num('kira'),tufe=num('tufe'),soz=num('sozlesme'),bes=el('besYil').checked;
  if(!(kira>0)||!(tufe>=0)){el('kiraResult').innerHTML='Mevcut kira bedelini ve TÜFE on iki aylık ortalama değişim oranını girin.';return}
  var html='';
  if(isFinite(soz)&&soz>=0){
    var oran=Math.min(soz,tufe),yeni=kira*(1+oran/100);
    html+=tiles([['Yeni aylık kira (en fazla)',money(yeni),1],['Uygulanabilecek artış oranı',p(oran)],['Sözleşmedeki oran',p(soz)],['Yasal üst sınır (TÜFE)',p(tufe)],['Aylık fark',money(yeni-kira)],['Yıllık fark',money((yeni-kira)*12)]]);
    if(soz>tufe)html+='<p class="note">Sözleşmedeki oran yasal üst sınırı aşıyor. TBK m.344\'e göre anlaşma, TÜFE on iki aylık ortalama değişim oranını geçmemek koşuluyla geçerlidir.</p>';
  }else{
    var ust=kira*(1+tufe/100);
    html+=tiles([['Yasal üst sınıra göre en yüksek aylık kira',money(ust),1],['Yasal üst sınır (TÜFE)',p(tufe)],['Aylık artış',money(ust-kira)]]);
    html+='<p class="note">Sözleşmede artış oranı belirtilmedi. Taraflar anlaşamazsa kira bedeli, bu oranı geçmemek koşuluyla hâkim tarafından hakkaniyete göre belirlenir (TBK m.344/2).</p>';
  }
  if(bes)html+='<p class="note">Kira ilişkisi beş yılı aşmışsa veya beş yıldan sonra yenilenmişse, yeni kira yılının bedeli kira tespit davasıyla TÜFE, kiralananın durumu ve emsal kira bedelleri dikkate alınarak hakkaniyete göre belirlenebilir (TBK m.344/3). Bu durumda yukarıdaki üst sınır mahkeme kararı için bağlayıcı değildir.</p>';
  el('kiraResult').innerHTML=html;
});
})();
