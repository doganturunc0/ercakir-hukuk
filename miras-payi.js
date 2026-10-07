(function(){
'use strict';
var el=function(id){return document.getElementById(id)};
var gcd=function(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t}return a||1};
function F(n,d){d=d||1;var g=gcd(n,d);return {n:n/g,d:d/g}}
function mul(a,b){return F(a.n*b.n,a.d*b.d)}
function add(a,b){return F(a.n*b.d+b.n*a.d,a.d*b.d)}
function sub(a,b){return F(a.n*b.d-b.n*a.d,a.d*b.d)}
function fmt(f){return f.n===0?'—':(f.d===1?String(f.n):f.n+'/'+f.d)}
function pct(f){return '%'+(f.n/f.d*100).toLocaleString('tr-TR',{maximumFractionDigits:2})}
function money(x){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(x)}
function int(id){var v=parseInt(el(id).value,10);return isFinite(v)&&v>0?v:0}
function yes(id){return el(id).value==='evet'}
function list(id){return (el(id).value||'').split(/[,;\s]+/).map(function(x){return parseInt(x,10)}).filter(function(x){return isFinite(x)&&x>=0})}
function hesapla(){
  var es=yes('es'),cocuk=int('cocuk'),olen=list('olenCocuk'),estate=parseFloat(el('tereke').value)||0;
  var heirs=[],note=[];
  var torunKollari=olen.filter(function(x){return x>0});
  var altsoyKol=cocuk+torunKollari.length;
  var esPay=F(0);
  if(altsoyKol>0){
    if(es)esPay=F(1,4);
    var kalan=sub(F(1),esPay),kol=F(kalan.n,kalan.d*altsoyKol);
    if(cocuk>0)heirs.push({ad:'Her bir çocuk ('+cocuk+' kişi)',adet:cocuk,pay:kol,sakli:mul(kol,F(1,2))});
    torunKollari.forEach(function(t,i){var p=F(kol.n,kol.d*t);heirs.push({ad:'Önce ölen '+(i+1)+'. çocuğun her bir çocuğu ('+t+' kişi)',adet:t,pay:p,sakli:mul(p,F(1,2))})});
    if(olen.length>torunKollari.length)note.push('Mirasbırakandan önce ölen ve çocuğu olmayan çocuklar paya katılmaz.');
  }else{
    var anne=yes('anne'),baba=yes('baba'),tam=int('tamKardes'),anaBir=int('anaKardes'),babaBir=int('babaKardes');
    var anneTaraf=anne?1:(tam+anaBir), babaTaraf=baba?1:(tam+babaBir);
    if(anneTaraf>0||babaTaraf>0){
      if(es)esPay=F(1,2);
      var z2=sub(F(1),esPay);
      var anneYarim=anneTaraf&&babaTaraf?mul(z2,F(1,2)):(anneTaraf?z2:F(0));
      var babaYarim=anneTaraf&&babaTaraf?mul(z2,F(1,2)):(babaTaraf?z2:F(0));
      if(anne)heirs.push({ad:'Anne',adet:1,pay:anneYarim,sakli:mul(anneYarim,F(1,4))});
      if(baba)heirs.push({ad:'Baba',adet:1,pay:babaYarim,sakli:mul(babaYarim,F(1,4))});
      var tamPay=F(0);
      if(!anne&&tam+anaBir>0)tamPay=add(tamPay,F(anneYarim.n,anneYarim.d*(tam+anaBir)));
      if(!baba&&tam+babaBir>0)tamPay=add(tamPay,F(babaYarim.n,babaYarim.d*(tam+babaBir)));
      if(tam>0&&tamPay.n>0)heirs.push({ad:'Her bir ana-baba bir kardeş ('+tam+' kişi)',adet:tam,pay:tamPay,sakli:F(0)});
      if(!anne&&anaBir>0)heirs.push({ad:'Her bir ana bir kardeş ('+anaBir+' kişi)',adet:anaBir,pay:F(anneYarim.n,anneYarim.d*(tam+anaBir)),sakli:F(0)});
      if(!baba&&babaBir>0)heirs.push({ad:'Her bir baba bir kardeş ('+babaBir+' kişi)',adet:babaBir,pay:F(babaYarim.n,babaYarim.d*(tam+babaBir)),sakli:F(0)});
      if(!anneTaraf||!babaTaraf)note.push('Bir tarafta mirasçı bulunmadığı için o tarafın payı diğer taraftaki mirasçılara geçmiştir (TMK m.496).');
      note.push('Kardeşlerin saklı payı yoktur.');
    }else if(yes('zumre3')){
      if(es)esPay=F(3,4);
      heirs.push({ad:'Büyükanne-büyükbaba zümresi (toplam)',adet:1,pay:sub(F(1),esPay),sakli:F(0)});
      note.push('Büyükanne ve büyükbaba zümresinin kendi içindeki dağılımı (TMK m.497) bu araçta ayrıntılı hesaplanmaz.');
    }else if(!es){
      el('mirasResult').innerHTML='Sağ kalan eş ve kan hısımı mirasçı bulunmadığında miras Devlete geçer (TMK m.501).';return;
    }else{esPay=F(1)}
  }
  if(es&&esPay.n>0){
    var esSakli=(altsoyKol>0||heirs.some(function(h){return /Anne|Baba|kardeş/.test(h.ad)}))?esPay:mul(esPay,F(3,4));
    heirs.unshift({ad:'Sağ kalan eş',adet:1,pay:esPay,sakli:esSakli});
  }
  if(!heirs.length){el('mirasResult').innerHTML='Lütfen mirasçı bilgilerini girin.';return}
  var rows=heirs.map(function(h){
    return '<tr><td data-label="Mirasçı">'+h.ad+'</td><td data-label="Yasal pay">'+fmt(h.pay)+'<br><small>'+pct(h.pay)+'</small></td><td data-label="Saklı pay">'+fmt(h.sakli)+(h.sakli.n?'<br><small>'+pct(h.sakli)+'</small>':'')+'</td>'+(estate>0?'<td data-label="Tutar">'+money(estate*h.pay.n/h.pay.d)+'</td>':'')+'</tr>'}).join('');
  var toplam=heirs.reduce(function(s,h){return add(s,F(h.pay.n*h.adet,h.pay.d))},F(0));
  el('mirasResult').innerHTML='<div class="calc-table-wrap"><table class="calc-table"><thead><tr><th>Mirasçı</th><th>Yasal miras payı</th><th>Saklı pay</th>'+(estate>0?'<th>Yasal paya düşen tutar</th>':'')+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<p class="meta">Payların toplamı: '+fmt(toplam)+'. '+note.join(' ')+'</p>';
}
function toggle(){var hasAltsoy=int('cocuk')>0||list('olenCocuk').some(function(x){return x>0});el('zumre2').hidden=hasAltsoy;var anne=yes('anne'),baba=yes('baba');var hasZ2=anne||baba||int('tamKardes')+int('anaKardes')+int('babaKardes')>0;el('zumre3Wrap').hidden=hasAltsoy||hasZ2}
['cocuk','olenCocuk','anne','baba','tamKardes','anaKardes','babaKardes'].forEach(function(id){el(id).addEventListener('input',toggle);el(id).addEventListener('change',toggle)});
el('mirasBtn').addEventListener('click',function(e){e.preventDefault();hesapla()});
toggle();
})();
