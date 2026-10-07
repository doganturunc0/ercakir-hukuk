const DAY_YEAR=365,DAY_MONTH=30;
const dval=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
const toDays=(y,m,d)=>y*DAY_YEAR+m*DAY_MONTH+d;
function dur(days){days=Math.max(0,Math.round(days));const y=Math.floor(days/365);days%=365;const m=Math.floor(days/30);const d=days%30;return `${y} yıl ${m} ay ${d} gün`}
function pdur(days){days=Math.max(0,Math.round(days));const y=Math.floor(days/365);days%=365;const m=Math.floor(days/30);const d=days%30;const parts=[];if(y)parts.push(y+' yıl');if(m)parts.push(m+' ay');if(d)parts.push(d+' gün');return parts.length?parts.join(' '):'0 gün'}
function fmtDate(dt){return new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(dt)}
function addDays(date,days){const x=new Date(date);x.setDate(x.getDate()+Math.max(0,Math.round(days)));return x}
function parseDate(v){return v?new Date(v+'T12:00:00'):null}
function selectedCrime(){return document.getElementById('crimeType').value}
function ageOn(birth,date){if(!birth||!date)return null;let a=date.getFullYear()-birth.getFullYear();const md=date.getMonth()-birth.getMonth();if(md<0||(md===0&&date.getDate()<birth.getDate()))a--;return a}
function baseRatio(crime,child){
  if(child&&['sexualBasic','sexualAggravated','drug188','organization','terror'].includes(crime))return 2/3;
  if(['sexualAggravated','drug188','terror'].includes(crime))return 3/4;
  if(['kill','injury87','torture','sexualBasic','privacy','organization','stateSecrets','mit'].includes(crime))return 2/3;
  return 1/2;
}
function ratioLabel(r){if(r>=.749)return'3/4';if(r>=.665)return'2/3';return'1/2'}
function child7593ClearException(crime){return['kill','drug188','organization'].includes(crime)}
function child7593SexualNeedsExactArticle(crime){return['sexualBasic','sexualAggravated'].includes(crime)}
function needsLegacyDsReview(crimeDate){return crimeDate&&crimeDate<=new Date('2023-07-31T23:59:59')}
function tenPercentRuleApplies(crimeDate){return crimeDate&&crimeDate>=new Date('2025-06-04T00:00:00')}
function pre6545TwoThirds(crime,crimeDate){return crimeDate&&crimeDate<new Date('2014-06-28T00:00:00')&&['sexualBasic','sexualAggravated','drug188'].includes(crime)}
function temporary6DsException(crime){return['kill','injury87','torture','sexualBasic','sexualAggravated','privacy','drug188','stateSecrets','terror'].includes(crime)}
function temporary6DsWindow(crime,crimeDate){return crimeDate&&crimeDate<=new Date('2020-03-30T23:59:59')&&!temporary6DsException(crime)?1095:365}
function removeUnsupportedSpecialFields(){['womanChild','age70','illness'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const wrapper=el.closest('label');if(wrapper)wrapper.remove();else el.remove()})}
removeUnsupportedSpecialFields();
function ratioWords(r){if(r>=.749)return'dörtte üçünü';if(r>=.665)return'üçte ikisini';return'yarısını'}
function plainUnsupportedReason(title){
  if(/tekerrür/i.test(title))return'Daha önce kesinleşmiş cezası olan (mükerrir) kişilerde hesap, önceki cezanın miktarına göre değişir. Bu bilgi formda olmadığı için tarih hesaplanmadı.';
  if(/çocuk|15 yaş|yaş verisi|yaş hesab|7593/i.test(title))return'Suç tarihinde 18 yaşından küçük olanlarda cezaevinde geçen günler özel kurallarla sayılır. Bu araç bu durumda güvenilir bir tarih veremiyor.';
  return'Bu durumda özel kurallar uygulandığı için araç güvenilir bir tarih veremiyor.';
}
function creditNote(credit,start){return credit>0&&start?`<div class="plain-warn"><b>Mahsup kontrolü:</b> Mahsup olarak <b>${pdur(credit)}</b> yazdınız. Bu süre, cezaevine giriş tarihinden <b>önce</b> geçen gözaltı veya tutukluluk olmalı. Kişi giriş tarihinden beri kesintisiz içerideyse ve tutukluluğu ayrıca yazdıysanız, aynı süre iki kez düşülür ve sonuç bu kadar erken çıkar. Bu durumda mahsup kutusunu boş bırakın.</div>`:''}
function showCreditConflict(credit,start,crimeDate){const result=document.getElementById('result');result.innerHTML=`<div class="plain"><div class="plain-head plain-head--warn"><span class="plain-kicker">KONTROL EDİN</span><p class="plain-big">Girdiğiniz tarihler birbirini tutmuyor.</p><p class="plain-sub">Mahsup olarak <b>${pdur(credit)}</b> yazdınız. Bu süre cezaevine giriş tarihinden (<b>${fmtDate(start)}</b>) önce geçmiş olsaydı, suç tarihinden (<b>${fmtDate(crimeDate)}</b>) önce başlamış olurdu. Bu mümkün değil; büyük ihtimalle aynı tutukluluk iki kez yazıldı.</p></div><div class="plain-why"><h4>Ne yapmalısınız?</h4><ul><li><b>Tutuklandığı günden beri kesintisiz içerideyse:</b> Cezaevine giriş tarihine tutuklandığı günü yazın ve mahsup kutusunu boş bırakın.</li><li><b>Tutuklanıp bırakıldıysa ve sonra yeniden girdiyse:</b> Giriş tarihine son girdiği günü, mahsuba ilk seferde içeride geçen süreyi yazın.</li></ul></div><button type="button" class="btn primary" id="fixCreditBtn">Mahsubu silip yeniden hesapla</button></div>`;result.classList.add('show');document.getElementById('fixCreditBtn').addEventListener('click',()=>{['creditYear','creditMonth','creditDay'].forEach(id=>{document.getElementById(id).value=''});document.getElementById('calculateBtn').click()});result.scrollIntoView({behavior:'smooth',block:'nearest'})}
function techBlock(inner){return`<details class="tech"><summary>Teknik ayrıntılar (hukukçular için)</summary><div class="tech-body">${inner}</div></details>`}
function plainWarn(){return`<div class="plain-warn"><b>Unutmayın:</b> Bu sonuç bir tahmindir, resmî müddetname değildir. Cezaevinde iyi hâlli olmak, açık cezaevine geçiş ve infaz hâkiminin kararı gibi şartlar tarihleri değiştirebilir. Kesin tarih, cezaevinin hazırladığı müddetnamede yazar.</div>`}
function showUnsupported(title,text){const result=document.getElementById('result');result.innerHTML=`<div class="plain"><div class="plain-head plain-head--warn"><span class="plain-kicker">KISACA SONUÇ</span><p class="plain-big">Bu bilgilerle kesin bir tarih hesaplanamıyor.</p><p class="plain-sub">${plainUnsupportedReason(title)}</p></div>${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">OTOMATİK HESAP SINIRI</div><div class="rate">${title}</div></div><div class="reason"><b>Bu senaryoda kesin tarih üretilmedi.</b><br>${text}<br><br>Sonuç için müddetname, fiilî kurum süreleri ve uygulanacak geçiş hükümleri ayrıca incelenmelidir.</div>`)}</div>`;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'})}
function calculateExecution(){
  const crime=selectedCrime();if(!crime){alert('Lütfen işlenen suç türünü seçiniz.');return}
  const total=toDays(dval('sentenceYear'),dval('sentenceMonth'),dval('sentenceDay'));if(total<=0){alert('Lütfen ceza miktarını giriniz.');return}
  const cd=parseDate(document.getElementById('crimeDate').value);if(!cd){alert('Suç tarihini giriniz. Geçiş hükümleri nedeniyle suç tarihi zorunludur.');return}
  const birth=parseDate(document.getElementById('birthDate').value),childBox=document.getElementById('childOffender').checked;
  const crimeAge=ageOn(birth,cd);
  if(birth&&birth>cd){alert('Doğum tarihi suç tarihinden sonra olamaz.');return}
  if(crimeAge!==null&&((crimeAge<18)!==childBox)){alert(crimeAge<18?'Suç tarihinde 18 yaş altı görünüyor. “Çocuk hükümlü” seçeneğini işaretleyiniz.':'Suç tarihinde 18 yaş ve üzeri görünüyor. “Çocuk hükümlü” seçeneğini kaldırınız.');return}
  const splash=document.getElementById('calcSplash');splash.classList.add('show');setTimeout(()=>{splash.classList.remove('show');performCalculation(crime,total,cd)},500)
}
function performCalculation(crime,total,crimeDate){
  const credit=toDays(dval('creditYear'),dval('creditMonth'),dval('creditDay'));
  const child=document.getElementById('childOffender').checked;
  const birth=parseDate(document.getElementById('birthDate').value),start=parseDate(document.getElementById('startDate').value);
  const ageAtStart=ageOn(birth,start);
  if(start&&credit>0&&crimeDate){const back=new Date(start);back.setDate(back.getDate()-credit);if(back<crimeDate){showCreditConflict(credit,start,crimeDate);return}}
  if(document.getElementById('recidivist').checked){
    showUnsupported('İlk tekerrür / 5275 m.108','İlk tekerrürde m.108/2 uyarınca koşullu salıverme süresine eklenecek miktar, tekerrüre esas alınan cezanın en ağırından fazla olamaz. Mevcut form tekerrüre esas önceki cezanın miktarını toplamadığından yalnızca 2/3 oranı uygulayarak kesin tarih üretmek güvenilir değildir.');return;
  }
  if(child&&crimeDate<=new Date('2020-03-30T23:59:59')){
    showUnsupported('Geçici 6/4 çocuk hükümlü yaş hesabı','30.03.2020 ve öncesinde işlenen suçlarda Geçici 6/4; 15 yaş dolduruluncaya kadar kurumda geçirilen bir günü üç gün, 18 yaş dolduruluncaya kadar kurumda geçirilen bir günü iki gün sayan özel hesap öngörür. Mevcut form bu yaş aralıklarında fiilen kurumda geçirilen süreleri güvenilir biçimde modellemediğinden otomatik koşullu salıverilme tarihi üretilmemiştir.');return;
  }
  if(child&&child7593SexualNeedsExactArticle(crime)&&birth&&start&&ageAtStart!==null&&ageAtStart<15){
    showUnsupported('7593 / cinsel suçta tam TCK maddesi gerekli','5275 m.107/5’in 2026 tarihli halinde yaş hesabı istisnası TCK 102 ve 103 için öngörülmüştür. Mevcut formdaki cinsel suç kategorileri TCK 102, 103, 104 ve 105 ayrımını kesin biçimde toplamadığından 15 yaş öncesi kurum süresi bakımından otomatik sonuç güvenilir değildir.');return;
  }
  if(!child7593ClearException(crime)&&!child7593SexualNeedsExactArticle(crime)&&birth&&start&&ageAtStart!==null&&ageAtStart<15){
    showUnsupported('7593 sayılı Kanun / 5275 m.107/5','İnfaza başlama tarihinde hükümlü 15 yaşını doldurmamış görünüyor. 5275 m.107/5 uyarınca 15 yaş dolduruluncaya kadar infaz kurumunda fiilen geçirilen bir gün iki gün olarak dikkate alınabilir. Form; fiilî kurumda kalış, kesinti ve nakil dönemlerini güvenilir biçimde modellemediğinden otomatik koşullu salıverilme tarihi üretilmemiştir.');return;
  }
  if(child&&!child7593ClearException(crime)&&(!birth||!start)){
    showUnsupported('7593 sayılı Kanun / yaş verisi gerekli','Çocuk hükümlü senaryosunda 5275 m.107/5 kontrolü için doğum tarihi ile infaza başlama/cezaevine giriş tarihi birlikte gereklidir. Bu veriler olmadan 15 yaş öncesi kurum süresi güvenilir biçimde değerlendirilemez.');return;
  }
  let ratio=baseRatio(crime,child),reasons=[];
  if(pre6545TwoThirds(crime,crimeDate)){ratio=2/3;reasons.push('28.06.2014 öncesi suç bakımından 6545 sayılı Kanunla getirilen özel 108/9 rejimi henüz yürürlükte olmadığından, o tarihte geçerli genel 2/3 koşullu salıverilme oranı esas alındı.');}
  else reasons.push('Temel koşullu salıverilme oranı '+ratioLabel(ratio)+' olarak değerlendirildi.');
  if(document.getElementById('secondRecidivist').checked){ratio=Math.max(ratio,3/4);reasons.push('4.6.2025 değişikliği sonrası ikinci defa tekerrürde süreli hapis için 3/4 oranı dikkate alındı; m.108/2 sınırı ikinci tekerrürde uygulanmaz.')}
  const ksGross=Math.ceil(total*ratio),ksAfterCredit=Math.max(0,ksGross-credit),fullAfterCredit=Math.max(0,total-credit);
  if(needsLegacyDsReview(crimeDate)){
    const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
    const result=document.getElementById('result');
    const legacyWindow=temporary6DsWindow(crime,crimeDate);
    if(legacyWindow===1095)reasons.push('30.03.2020 ve öncesindeki, Geçici 6/1 istisnaları dışında kalan suçlarda 105/A bakımından üç yıllık özel pencere bulunduğu tespit edildi; ancak Geçici 10 ve sonraki geçiş hükümleri nedeniyle kesin DS tarihi otomatik üretilmedi.');
    const startL=parseDate(document.getElementById('startDate').value);
    const ksDateL=startL?fmtDate(addDays(startL,ksAfterCredit)):null;
    result.innerHTML=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${ksDateL?`<p class="plain-big">Koşullu salıverilme için tahmini tarih: <b>${ksDateL}</b></p>`:`<p class="plain-big">Koşullu salıverilmeye kadar geçmesi gereken süre: <b>${pdur(ksAfterCredit)}</b></p>`}<p class="plain-sub">Suç 31 Temmuz 2023 veya öncesinde işlendiği için, denetimli serbestlikle cezaevinden ne zaman çıkılabileceği geçiş hükümlerine bağlıdır ve bu araçla otomatik hesaplanmıyor. Denetimli serbestlik tarihi bu tarihten <b>daha önce</b> olur.</p>${ksDateL?'':'<p class="plain-sub">Tarih görmek için yukarıya cezaevine giriş tarihini yazın.</p>'}</div><div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${pdur(total)}</b></li>${credit>0?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${pdur(credit)}</b></li>`:''}<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${pdur(ksGross)}</b></li>${credit>0?`<li>Düşülen süre çıkarıldıktan sonra kalan: <b>${pdur(ksAfterCredit)}</b></li>`:''}</ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Doğrulanabilen aritmetik</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${dur(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${dur(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${dur(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${dur(ksAfterCredit)}</b></div></div><div class="reason"><b>Denetimli serbestlik tarihi otomatik üretilmedi.</b><br>31.07.2023 ve öncesindeki suçlarda 5275 sayılı Kanunun geçici 6 ve geçici 10 hükümleri ile 25.12.2025 değişiklikleri; kurum türü, kurumda geçirilen süre ve istisna suçlar bakımından ayrıca değerlendirme gerektirir. Mevcut form bu verilerin tamamını toplamamaktadır.<br>${reasons.join('<br>')}</div>`)}</div>`;
    result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});return;
  }
  const dsWindow=365;
  let prison=Math.max(0,ksAfterCredit-dsWindow);
  let prisonEarly=null,tenLi='';
  if(tenPercentRuleApplies(crimeDate)){
    const minInstitution=Math.max(5,Math.ceil(ksGross/10)),prisonBase=prison;
    prison=Math.max(prisonBase,minInstitution);
    reasons.push('4.6.2025 sonrası suçlarda 105/A için en az 5 gün ve koşullu salıverilmeye kadar kurumda geçirilmesi gereken sürenin en az 1/10’u kontrolü uygulandı.');
    if(prison>prisonBase)tenLi=`<li>4 Haziran 2025 ve sonrasında işlenen suçlarda, denetimli serbestliğe çıkabilmek için koşullu salıverilmeye kadarki sürenin en az onda biri (en az 5 gün) cezaevinde geçirilmelidir: <b>${pdur(minInstitution)}</b></li>`;
    if(credit>0){
      const early=Math.max(prisonBase,minInstitution-credit,0);
      if(early<prison){prisonEarly=early;reasons.push('Mahsup edilen sürenin ne kadarının ceza infaz kurumunda (tutuklulukta) geçtiği formdan anlaşılamadığından 1/10 kurum süresi şartı ihtiyatlı biçimde yalnızca infaza başlamadan sonraki süreye uygulandı. Mahsup süresinin tamamı kurumda geçmişse DS eşiği '+(early===0?'infaza başlama tarihine':'infaza başlamadan '+dur(early)+' sonrasına')+' kadar öne gelebilir.');}
    }
  }
  const dsActual=Math.max(0,ksAfterCredit-prison);
  let dateCards='',timeline='';
  if(start){
    const dsDate=addDays(start,prison),ksDate=addDays(start,ksAfterCredit),fullDate=addDays(start,fullAfterCredit);
    dateCards=`<div class="stat highlight"><span>DENETİMLİ SERBESTLİK İÇİN ARİTMETİK EŞİK</span><b>${fmtDate(dsDate)}</b></div><div class="stat highlight"><span>KOŞULLU SALIVERİLME ARİTMETİK TARİHİ</span><b>${fmtDate(ksDate)}</b></div>`;
    timeline=`<h3 class="result-title">Aritmetik zaman çizelgesi</h3><div class="timeline"><div class="timeline-row"><span>İNFAZA BAŞLAMA</span><strong>${fmtDate(start)}</strong></div><div class="timeline-row"><span>DS ARİTMETİK EŞİĞİ</span><strong>${fmtDate(dsDate)}</strong></div><div class="timeline-row"><span>KS ARİTMETİK TARİHİ</span><strong>${fmtDate(ksDate)}</strong></div><div class="timeline-row"><span>BİHAKKIN ARİTMETİK TARİH</span><strong>${fmtDate(fullDate)}</strong></div></div>`;
  }
  const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
  const html=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${start?(prison>0?`<p class="plain-big">En erken <b>${fmtDate(addDays(start,prison))}</b> tarihinde denetimli serbestlikle cezaevinden çıkış mümkün olabilir.</p>`:`<p class="plain-big">Hesaba göre cezaevinde kalınacak süre çok kısa; denetimli serbestlik değerlendirmesi hemen gündeme gelebilir.</p>`):`<p class="plain-big">Cezaevinde kalınacak tahmini süre: <b>${pdur(prison)}</b></p>`}<p class="plain-sub">${start&&prison>0?'Bu tarihten':'Bu süreden'} sonra cezanın kalanı dışarıda, imza ve kurallara uyma gibi yükümlülüklerle geçirilir. Bunun için cezaevinde iyi hâlli olmak ve infaz hâkiminin onayı gerekir.</p>${prisonEarly!==null?`<p class="plain-sub">Tutuklulukta cezaevinde geçen süre de hesaba katılırsa ${prisonEarly===0?'denetimli serbestlik hemen gündeme gelebilir.':start?`çıkış tarihi öne gelebilir (en erken: <b>${fmtDate(addDays(start,prisonEarly))}</b>).`:`cezaevinde kalınacak süre kısalabilir (en kısa: <b>${pdur(prisonEarly)}</b>).`}</p>`:''}${start?'':'<p class="plain-sub"><b>Tarihleri görmek için yukarıya cezaevine giriş tarihini yazın.</b></p>'}</div>${start?`<ol class="plain-steps"><li><span class="ps-when">${fmtDate(start)} → ${fmtDate(addDays(start,prison))}</span><strong>Cezaevi dönemi</strong><p>Yaklaşık <b>${pdur(prison)}</b> cezaevinde kalınır.</p></li><li><span class="ps-when">${fmtDate(addDays(start,prison))} → ${fmtDate(addDays(start,ksAfterCredit))}</span><strong>Denetimli serbestlik</strong><p>Yaklaşık <b>${pdur(dsActual)}</b> dışarıda, imza ve kurallara uyarak geçirilir. Kurallara uyulmazsa cezaevine geri dönülebilir.</p></li><li><span class="ps-when">${fmtDate(addDays(start,ksAfterCredit))}</span><strong>Koşullu salıverilme</strong><p>Cezaevi ile ilişki sona erer. Ancak cezanın asıl bitiş tarihine kadar “denetim süresi” devam eder; bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.</p></li><li><span class="ps-when">${fmtDate(addDays(start,fullAfterCredit))}</span><strong>Cezanın tamamen bitmesi</strong><p>Mahkemenin verdiği cezanın tamamı dolar.</p></li></ol>`:''}<div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${pdur(total)}</b></li>${credit>0?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${pdur(credit)}</b></li>`:''}<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${pdur(ksGross)}</b>${credit>0?` (düşülen süre çıkarılınca <b>${pdur(ksAfterCredit)}</b>)`:''}</li><li>Bu sürenin koşullu salıverilmeden önceki son kısmı (en fazla 1 yıl) denetimli serbestlikle dışarıda geçirilebilir: <b>${pdur(dsActual)}</b></li>${tenLi}<li>${tenLi?'Bu nedenle cezaevinde geçirilecek süre':'Geriye kalan kısım cezaevinde geçirilir'}: <b>${pdur(prison)}</b></li></ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Süre parametreleri</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${dur(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${dur(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${dur(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${dur(ksAfterCredit)}</b></div><div class="stat"><span>TAHMİNİ KURUM SÜRESİ</span><b>${dur(prison)}</b></div><div class="stat"><span>TAHMİNİ DS SÜRESİ</span><b>${dur(dsActual)}</b></div>${dateCards}</div>${timeline}<div class="reason"><b>Hesaplama açıklaması</b><br>${reasons.join('<br>')}<br>105/A uygulaması ayrıca açık kurum/çocuk eğitimevi statüsü, iyi hâl ve infaz hâkimi değerlendirmesine bağlıdır. Açık kuruma ayrılma ve dosyaya özgü geçiş hükümleri otomatik kesinleştirilmez. Sonuç resmi müddetname değildir.</div>`)}</div>`;
  const result=document.getElementById('result');result.innerHTML=html;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function resetForm(){document.querySelectorAll('input').forEach(i=>{if(i.type==='checkbox')i.checked=false;else i.value=''});document.getElementById('crimeType').value='';const r=document.getElementById('result');r.classList.remove('show');r.innerHTML=''}
document.getElementById('secondRecidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('recidivist').checked=false});
document.getElementById('recidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('secondRecidivist').checked=false});