const DAY_YEAR=365,DAY_MONTH=30;
const dval=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
const toDays=(y,m,d)=>y*DAY_YEAR+m*DAY_MONTH+d;
function fmtDate(dt){return new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(dt)}
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
function creditNote(credit,start){return U(credit)>0&&start?`<div class="plain-warn"><b>Mahsup kontrolü:</b> Mahsup olarak <b>${fdur(credit)}</b> yazdınız. Bu süre, cezaevine giriş tarihinden <b>önce</b> geçen gözaltı veya tutukluluk olmalı. Kişi giriş tarihinden beri kesintisiz içerideyse ve tutukluluğu ayrıca yazdıysanız, aynı süre iki kez düşülür ve sonuç bu kadar erken çıkar. Bu durumda mahsup kutusunu boş bırakın.</div>`:''}
function showCreditConflict(credit,start,crimeDate){const result=document.getElementById('result');result.innerHTML=`<div class="plain"><div class="plain-head plain-head--warn"><span class="plain-kicker">KONTROL EDİN</span><p class="plain-big">Girdiğiniz tarihler birbirini tutmuyor.</p><p class="plain-sub">Mahsup olarak <b>${fdur(credit)}</b> yazdınız. Bu süre cezaevine giriş tarihinden (<b>${fmtDate(start)}</b>) önce geçmiş olsaydı, suç tarihinden (<b>${fmtDate(crimeDate)}</b>) önce başlamış olurdu. Bu mümkün değil; büyük ihtimalle aynı tutukluluk iki kez yazıldı.</p></div><div class="plain-why"><h4>Ne yapmalısınız?</h4><ul><li><b>Tutuklandığı günden beri kesintisiz içerideyse:</b> Cezaevine giriş tarihine tutuklandığı günü yazın ve mahsup kutusunu boş bırakın.</li><li><b>Tutuklanıp bırakıldıysa ve sonra yeniden girdiyse:</b> Giriş tarihine son girdiği günü, mahsuba ilk seferde içeride geçen süreyi yazın.</li></ul></div><button type="button" class="btn primary" id="fixCreditBtn">Mahsubu silip yeniden hesapla</button></div>`;result.classList.add('show');document.getElementById('fixCreditBtn').addEventListener('click',()=>{['creditYear','creditMonth','creditDay'].forEach(id=>{document.getElementById(id).value=''});document.getElementById('calculateBtn').click()});result.scrollIntoView({behavior:'smooth',block:'nearest'})}
function showStartBeforeCrime(start,crimeDate){const result=document.getElementById('result');result.innerHTML=`<div class="plain"><div class="plain-head plain-head--warn"><span class="plain-kicker">KONTROL EDİN</span><p class="plain-big">Cezaevine giriş tarihi suç tarihinden önce olamaz.</p><p class="plain-sub">Cezaevine giriş tarihi <b>${fmtDate(start)}</b>, suç tarihi ise <b>${fmtDate(crimeDate)}</b> yazılmış. Kişi bu suç için, suçu işlemeden önce cezaevine girmiş olamaz. Büyük ihtimalle yıl yanlış seçildi.</p></div><div class="plain-why"><h4>Ne yapmalısınız?</h4><ul><li>Cezaevine giriş tarihini kontrol edin. Tutuklandıysa tutuklandığı günü yazın.</li><li>Suç tarihini de kontrol edin; iddianamede veya kararda yazan tarihi kullanın.</li></ul></div></div>`;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'})}
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
// Müddetname uygulaması: ceza güne çevrilir (yıl 365, ay 30 gün), tarihler giriş tarihine gün eklenerek bulunur.
const ZERO=0;
const dur3=(y,m,d)=>Math.max(0,Math.round(y*365+m*30+d));
const U=t=>t;
function dsub(a,b){return Math.max(0,a-b)}
function dadd(a,b){return a+b}
function dmax(...a){return Math.max(...a)}
function frac(t,r){return Math.ceil(t*r-1e-9)}
function at(start,t,sign=1){const x=new Date(start);x.setDate(x.getDate()+sign*Math.round(t));return x}
function ymd(t){t=Math.max(0,Math.round(t));const y=Math.floor(t/365),r=t%365;return[y,Math.floor(r/30),r%30]}
function fdur(t){const[y,m,d]=ymd(t),p=[];if(y)p.push(y+' yıl');if(m)p.push(m+' ay');if(d)p.push(d+' gün');return p.length?p.join(' '):'0 gün'}
function fdurAbout(t){let[y,m,d]=ymd(t);if(d<=2)d=0;else if(d>=28){d=0;m++}if(m>=12){y++;m-=12}const p=[];if(y)p.push(y+' yıl');if(m)p.push(m+' ay');if(d)p.push(d+' gün');return p.length?p.join(' '):'0 gün'}
function between(a,b){return Math.max(0,Math.round((b-a)/864e5))}
function fdurFull(t){const[y,m,d]=ymd(t);return`${y} yıl ${m} ay ${d} gün (${Math.round(t)} gün)`}
const OPEN_FIVE=['qualifiedTheft','robbery','drug188','drug190'],SEXUAL=['sexualBasic','sexualAggravated'],NO_OPEN=['terror','organization'],SPOUSE_NOTE=['kill','torture'];
function performCalculation(crime,totalDays,crimeDate){
  const total=dur3(dval('sentenceYear'),dval('sentenceMonth'),dval('sentenceDay'));
  const credit=dur3(dval('creditYear'),dval('creditMonth'),dval('creditDay')),hasCredit=U(credit)>0;
  const child=document.getElementById('childOffender').checked,secondRec=document.getElementById('secondRecidivist').checked;
  const birth=parseDate(document.getElementById('birthDate').value),start=parseDate(document.getElementById('startDate').value);
  const ageAtStart=ageOn(birth,start);
  if(start&&crimeDate&&start<crimeDate){showStartBeforeCrime(start,crimeDate);return}
  if(start&&hasCredit&&crimeDate&&at(start,credit,-1)<crimeDate){showCreditConflict(credit,start,crimeDate);return}
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
  let ratio=baseRatio(crime,child),reasons=['Süreler müddetname uygulamasındaki gibi güne çevrilerek hesaplandı (yıl 365, ay 30 gün); tarihler infaza başlama tarihine gün eklenerek bulundu.'];
  if(pre6545TwoThirds(crime,crimeDate)){ratio=2/3;reasons.push('28.06.2014 öncesi suç bakımından 6545 sayılı Kanunla getirilen özel 108/9 rejimi henüz yürürlükte olmadığından, o tarihte geçerli genel 2/3 koşullu salıverilme oranı esas alındı.');}
  else reasons.push('Temel koşullu salıverilme oranı '+ratioLabel(ratio)+' olarak değerlendirildi.');
  if(secondRec){ratio=Math.max(ratio,3/4);reasons.push('4.6.2025 değişikliği sonrası ikinci defa tekerrürde süreli hapis için 3/4 oranı dikkate alındı; m.108/2 sınırı ikinci tekerrürde uygulanmaz.')}
  const ksGross=frac(total,ratio),ksNet=dsub(ksGross,credit),fullNet=dsub(total,credit);
  const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
  const when=t=>start?fmtDate(at(start,t)):null;
  // Açık ceza infaz kurumu (Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği m.5, 6, 7, 8)
  const ageAtExec=ageOn(birth,start||new Date()),adultAtExec=child&&ageAtExec!==null&&ageAtExec>=18,juv=child&&!adultAtExec;
  if(adultAtExec)reasons.push('Suç tarihinde çocuk olan hükümlü infaza '+(start?'başlama tarihinde':'bugün itibarıyla')+' 18 yaşını doldurmuş görünüyor; koşullu salıverilme oranı suç tarihindeki yaşa göre belirlendi, kurum ve açık kuruma ayrılma kuralları yetişkin hükümlüler gibi uygulandı.');
  const sexual=SEXUAL.includes(crime),noOpen=!juv&&NO_OPEN.includes(crime);
  const directOpen=!juv&&!noOpen&&!sexual&&!secondRec&&total<=1095;
  const closedMin=total>=3650?frac(total,1/10):30;
  const beforeKs=(years,strict)=>{const r=dsub(ksNet,years*365);return strict&&U(r)>0?dadd(r,1):r};
  let openAt=null,openAlt=null,openLi='';
  if(!juv&&!noOpen){
    if(directOpen){openAt=0;openLi='<li>Toplam cezası 3 yıl veya daha az olan (terör, örgüt ve cinsel suçlar hariç) hükümlüler cezaya doğrudan açık cezaevinde başlar.</li>'}
    else if(OPEN_FIVE.includes(crime)){openAt=dmax(closedMin,beforeKs(5,true));openLi=`<li>Açık cezaevine geçmek için ${total>=3650?'cezanın onda biri':'en az 1 ay'} kapalı cezaevinde geçirilmeli ve bu suç türünde koşullu salıverilmeye <b>5 yıldan az</b> kalmış olmalıdır.</li>`}
    else if(sexual){openAt=dmax(closedMin,beforeKs(3,true));openAlt=dmax(closedMin,beforeKs(7,false));openLi=`<li>Açık cezaevine geçmek için ${total>=3650?'cezanın onda biri':'en az 1 ay'} kapalı cezaevinde geçirilmeli; TCK 102 ve 103’te koşullu salıverilmeye <b>3 yıldan az</b>, TCK 104 ve 105’te <b>7 yıl veya daha az</b> kalmış olmalıdır.</li>`}
    else{openAt=dmax(closedMin,beforeKs(7,false));openLi=`<li>Açık cezaevine geçmek için ${total>=3650?'cezanın onda biri':'en az 1 ay'} kapalı cezaevinde geçirilmeli ve koşullu salıverilmeye <b>7 yıl veya daha az</b> kalmış olmalıdır.</li>`}
    if(U(openAt)>U(ksNet))openAt=ksNet;
    reasons.push('Açık kuruma ayrılma: Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği m.5 ve m.6 (4.6.2025 değişiklikli hâli). Kapalı kurumda geçirilmesi gereken süre ihtiyatlı biçimde infaza başlama tarihinden itibaren sayıldı; tutukluluk süresi kurumda geçmiş sayılırsa açığa ayrılma daha erken olabilir.');
  }
  if(noOpen)reasons.push('Terör ve örgütlü suçlardan hükümlüler Yönetmelik m.8/1-ç uyarınca açık kuruma ayrılamaz (m.6/2-c ve ç istisnaları hariç). 105/A denetimli serbestliği açık kurumda veya çocuk eğitimevinde bulunmayı gerektirdiğinden DS tarihi üretilmedi.');
  const adultLi=adultAtExec?`<li>Suç tarihinde 18 yaşından küçük olduğu için koşullu salıverilme oranı çocuklara göre uygulanır. Ancak cezaevine girdiğinde 18 yaşını doldurmuş olacağı için çocuk eğitimevine değil yetişkin (gençlik) kurumlarına alınır; açık cezaevine geçiş kuralları buna göre uygulanır.</li>`:'';
  const childLi=adultLi||(juv?`<li>Çocuk hükümlüler cezalarını kural olarak çocuk eğitimevinde çeker. Çocuk eğitimevindeyken 18 yaşını bitiren (eğitime devam ediyorsa 21 yaşını bitiren) hükümlü, suç türüne bakılmaksızın açık cezaevine gönderilir${birth?` (18 yaşını bitirdiği tarih: <b>${fmtDate(new Date(birth.getFullYear()+18,birth.getMonth(),birth.getDate(),12))}</b>)`:''}.</li>`:'');
  if(needsLegacyDsReview(crimeDate)){
    const result=document.getElementById('result');
    const legacyWindow=temporary6DsWindow(crime,crimeDate);
    if(legacyWindow===1095)reasons.push('30.03.2020 ve öncesindeki, Geçici 6/1 istisnaları dışında kalan suçlarda 105/A bakımından üç yıllık özel pencere bulunduğu tespit edildi; ancak Geçici 10 ve sonraki geçiş hükümleri nedeniyle kesin DS tarihi otomatik üretilmedi.');
    const ksDateL=when(ksNet);
    const openLegacy=openAt!==null&&!directOpen&&U(openAt)>0?`<li>Açık cezaevine geçiş için ${start?'tahmini en erken tarih':'kapalı cezaevinde geçecek tahmini süre'}: <b>${start?when(openAt):fdur(openAt)}</b></li>`:'';
    result.innerHTML=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${ksDateL?`<p class="plain-big">Koşullu salıverilme için tahmini tarih: <b>${ksDateL}</b></p>`:`<p class="plain-big">Koşullu salıverilmeye kadar geçmesi gereken süre: <b>${fdur(ksNet)}</b></p>`}<p class="plain-sub">Suç 31 Temmuz 2023 veya öncesinde işlendiği için, denetimli serbestlikle cezaevinden ne zaman çıkılabileceği geçiş hükümlerine bağlıdır ve bu araçla otomatik hesaplanmıyor. Denetimli serbestlik tarihi bu tarihten <b>daha önce</b> olur.</p>${ksDateL?'':'<p class="plain-sub">Tarih görmek için yukarıya cezaevine giriş tarihini yazın.</p>'}</div><div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${fdur(total)}</b></li>${hasCredit?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${fdur(credit)}</b></li>`:''}<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${fdur(ksGross)}</b></li>${hasCredit?`<li>Düşülen süre çıkarıldıktan sonra kalan: <b>${fdur(ksNet)}</b></li>`:''}${directOpen?openLi:openLegacy?openLi+openLegacy:''}${noOpen?'<li>Terör ve örgüt suçlarında kural olarak açık cezaevine geçilemez.</li>':''}${childLi}</ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Doğrulanabilen aritmetik</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${fdurFull(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${fdurFull(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${fdurFull(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${fdurFull(ksNet)}</b></div></div><div class="reason"><b>Denetimli serbestlik tarihi otomatik üretilmedi.</b><br>31.07.2023 ve öncesindeki suçlarda 5275 sayılı Kanunun geçici 6 ve geçici 10 hükümleri ile 25.12.2025 değişiklikleri; kurum türü, kurumda geçirilen süre ve istisna suçlar bakımından ayrıca değerlendirme gerektirir. Mevcut form bu verilerin tamamını toplamamaktadır.<br>${reasons.join('<br>')}</div>`)}</div>`;
    result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});return;
  }
  const dsWindow=365;
  const prisonBase=dsub(ksNet,dsWindow);
  let prison=prisonBase,prisonEarly=null,tenLi='';
  if(tenPercentRuleApplies(crimeDate)){
    const minInstitution=dmax(frac(ksGross,1/10),5);
    prison=dmax(prisonBase,minInstitution);
    reasons.push('4.6.2025 sonrası suçlarda 105/A için en az 5 gün ve koşullu salıverilmeye kadar kurumda geçirilmesi gereken sürenin en az 1/10’u kontrolü uygulandı.');
    if(U(prison)>U(prisonBase))tenLi=`<li>4 Haziran 2025 ve sonrasında işlenen suçlarda, denetimli serbestliğe çıkabilmek için koşullu salıverilmeye kadarki sürenin en az onda biri (en az 5 gün) cezaevinde geçirilmelidir: <b>${fdur(minInstitution)}</b></li>`;
    if(hasCredit){
      const early=dmax(prisonBase,dsub(minInstitution,credit));
      if(U(early)<U(prison)){prisonEarly=early;reasons.push('Mahsup edilen sürenin ne kadarının ceza infaz kurumunda (tutuklulukta) geçtiği formdan anlaşılamadığından 1/10 kurum süresi şartı ihtiyatlı biçimde yalnızca infaza başlamadan sonraki süreye uygulandı. Mahsup süresinin tamamı kurumda geçmişse DS eşiği '+(U(early)===0?'infaza başlama tarihine':'infaza başlamadan '+fdurFull(early)+' sonrasına')+' kadar öne gelebilir.');}
    }
  }
  if(openAt!==null&&U(openAt)>U(prison)){prison=openAt;prisonEarly=null;reasons.push('105/A için açık kurumda bulunma şartı nedeniyle DS eşiği açık kuruma ayrılma tarihinden önce olamaz.')}
  if(noOpen){prison=ksNet;prisonEarly=null}
  const dsActual=dsub(ksNet,prison);
  const closedPart=openAt!==null?openAt:prison,openPart=openAt!==null?dsub(prison,openAt):ZERO;
  let dateCards='',timeline='';
  if(start){
    dateCards=`${openAt!==null&&U(openAt)>0?`<div class="stat highlight"><span>AÇIK KURUMA AYRILMA (TAHMİNİ)</span><b>${when(openAt)}</b></div>`:''}${noOpen?'':`<div class="stat highlight"><span>DENETİMLİ SERBESTLİK İÇİN ARİTMETİK EŞİK</span><b>${when(prison)}</b></div>`}<div class="stat highlight"><span>KOŞULLU SALIVERİLME ARİTMETİK TARİHİ</span><b>${when(ksNet)}</b></div>`;
    timeline=`<h3 class="result-title">Aritmetik zaman çizelgesi</h3><div class="timeline"><div class="timeline-row"><span>İNFAZA BAŞLAMA</span><strong>${fmtDate(start)}</strong></div>${openAt!==null&&U(openAt)>0?`<div class="timeline-row"><span>AÇIK KURUMA AYRILMA</span><strong>${when(openAt)}</strong></div>`:''}${noOpen?'':`<div class="timeline-row"><span>DS ARİTMETİK EŞİĞİ</span><strong>${when(prison)}</strong></div>`}<div class="timeline-row"><span>KS ARİTMETİK TARİHİ</span><strong>${when(ksNet)}</strong></div><div class="timeline-row"><span>BİHAKKIN ARİTMETİK TARİH</span><strong>${when(fullNet)}</strong></div></div>`;
  }
  const spouse=SPOUSE_NOTE.includes(crime)?' Suç eşe karşı işlendiyse koşullu salıverilmeye 3 yıldan az kalması gerekir; bu durumda geçiş daha geç olur.':'';
  const altTxt=openAlt!==null&&U(openAlt)<U(openAt)?` TCK 104 veya 105’ten hüküm giyildiyse geçiş daha erken olabilir: <b>${start?when(openAlt):fdur(openAlt)+' sonra'}</b>.`:'';
  const b18=birth?new Date(birth.getFullYear()+18,birth.getMonth(),birth.getDate(),12):null;
  const juvOpen=juv&&start&&b18&&b18>start&&b18<at(start,prison);
  const steps=[];
  if(start){
    if(noOpen){
      steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(ksNet)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdur(ksNet)}</b> kapalı cezaevinde kalınır. Terör ve örgüt suçlarında kural olarak açık cezaevine geçilemez; bu yüzden denetimli serbestlik de uygulanmaz.</p></li>`);
    }else if(juv){
      if(juvOpen){
        steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${fmtDate(b18)}</span><strong>Çocuk eğitimevi</strong><p>18 yaşını bitirene kadar yaklaşık <b>${fdurAbout(between(start,b18))}</b> çocuk eğitimevinde kalınır.</p></li>`);
        steps.push(`<li><span class="ps-when">${fmtDate(b18)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>18 yaşını bitirince suç türüne bakılmaksızın açık cezaevine gönderilir; eğitime devam ediyorsa bu 21 yaşını bitirince olur. Yaklaşık <b>${fdurAbout(between(b18,at(start,prison)))}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
      }else steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(prison)}</span><strong>Çocuk eğitimevi</strong><p>Yaklaşık <b>${fdur(prison)}</b> çocuk eğitimevinde kalınır.</p></li>`);
    }else{
      if(!directOpen&&U(closedPart)>0)steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(closedPart)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdurAbout(closedPart)}</b> kapalı cezaevinde kalınır. Açık cezaevine geçmek için iyi hâlli olmak ve cezaevi idaresinin kararı gerekir.${spouse}${altTxt}</p></li>`);
      if(U(openPart)>0||directOpen)steps.push(`<li><span class="ps-when">${when(openAt)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>${directOpen?'Ceza 3 yıl veya daha az olduğu için doğrudan açık cezaevine alınır. ':''}Yaklaşık <b>${fdurAbout(openPart)}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
    }
    if(!noOpen)steps.push(`<li><span class="ps-when">${when(prison)} → ${when(ksNet)}</span><strong>Denetimli serbestlik</strong><p>Yaklaşık <b>${fdur(dsActual)}</b> dışarıda, imza ve kurallara uyarak geçirilir. Kurallara uyulmazsa cezaevine geri dönülebilir.</p></li>`);
    steps.push(`<li><span class="ps-when">${when(ksNet)}</span><strong>Koşullu salıverilme</strong><p>Cezaevi ile ilişki sona erer. Ancak cezanın asıl bitiş tarihine kadar “denetim süresi” devam eder; bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.</p></li>`);
    steps.push(`<li><span class="ps-when">${when(fullNet)}</span><strong>Cezanın tamamen bitmesi</strong><p>Mahkemenin verdiği cezanın tamamı dolar.</p></li>`);
  }
  let head;
  if(noOpen){
    head=`<p class="plain-big">${start?`Koşullu salıverilme için tahmini tarih: <b>${when(ksNet)}</b>`:`Koşullu salıverilmeye kadar cezaevinde kalınacak tahmini süre: <b>${fdur(ksNet)}</b>`}</p><p class="plain-sub">Terör ve örgüt suçlarında kural olarak açık cezaevine geçilemediği için denetimli serbestlikle erken çıkış uygulanmaz. Örgütten ayrıldığı cezaevi kurulunca tespit edilen hükümlü koşullu salıverilmeye 1 yıldan az kala, etkin pişmanlıktan (TCK 221) yararlanan hükümlü 2 yıldan az kala açık cezaevine geçebilir; bu durumda denetimli serbestlik gündeme gelebilir.</p>`;
  }else{
    head=`${start?(U(prison)>0?`<p class="plain-big">En erken <b>${when(prison)}</b> tarihinde denetimli serbestlikle cezaevinden çıkış mümkün olabilir.</p>`:`<p class="plain-big">Hesaba göre cezaevinde kalınacak süre çok kısa; denetimli serbestlik değerlendirmesi hemen gündeme gelebilir.</p>`):`<p class="plain-big">Cezaevinde kalınacak tahmini süre: <b>${fdur(prison)}</b></p>`}${!juv&&openAt!==null&&U(prison)>0?`<p class="plain-sub">Bu sürenin ${directOpen?'tamamı açık cezaevinde geçer.':U(openPart)>0?`yaklaşık <b>${fdurAbout(closedPart)}</b> kısmı kapalı, <b>${fdurAbout(openPart)}</b> kısmı açık cezaevinde geçer.`:'tamamı kapalı cezaevinde geçer.'}</p>`:''}${juvOpen?`<p class="plain-sub">Bu sürenin yaklaşık <b>${fdurAbout(between(start,b18))}</b> kısmı çocuk eğitimevinde, <b>${fdurAbout(between(b18,at(start,prison)))}</b> kısmı açık cezaevinde geçer.</p>`:''}<p class="plain-sub">${start&&U(prison)>0?'Bu tarihten':'Bu süreden'} sonra cezanın kalanı dışarıda, imza ve kurallara uyma gibi yükümlülüklerle geçirilir. Bunun için cezaevinde iyi hâlli olmak ve infaz hâkiminin onayı gerekir.</p>${prisonEarly!==null?`<p class="plain-sub">Tutuklulukta cezaevinde geçen süre de hesaba katılırsa ${U(prisonEarly)===0?'denetimli serbestlik hemen gündeme gelebilir.':start?`çıkış tarihi öne gelebilir (en erken: <b>${when(prisonEarly)}</b>).`:`cezaevinde kalınacak süre kısalabilir (en kısa: <b>${fdur(prisonEarly)}</b>).`}</p>`:''}`;
  }
  const html=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${head}${start?'':'<p class="plain-sub"><b>Tarihleri görmek için yukarıya cezaevine giriş tarihini yazın.</b></p>'}</div>${steps.length?`<ol class="plain-steps">${steps.join('')}</ol>`:''}<div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${fdur(total)}</b></li>${hasCredit?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${fdur(credit)}</b></li>`:''}<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${fdur(ksGross)}</b>${hasCredit?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>${openLi}${noOpen?'':`<li>Bu sürenin koşullu salıverilmeden önceki son kısmı (en fazla 1 yıl) denetimli serbestlikle dışarıda geçirilebilir: <b>${fdur(dsActual)}</b></li>${tenLi}<li>${tenLi?'Bu nedenle cezaevinde geçirilecek süre':'Geriye kalan kısım cezaevinde geçirilir'}: <b>${fdur(prison)}</b></li>`}${noOpen?'<li>Terör ve örgüt suçlarından hükümlüler kural olarak açık cezaevine geçemez; denetimli serbestlik için açık cezaevinde bulunmak gerekir.</li>':''}${childLi}</ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Süre parametreleri</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${fdurFull(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${fdurFull(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${fdurFull(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${fdurFull(ksNet)}</b></div><div class="stat"><span>TAHMİNİ KURUM SÜRESİ</span><b>${fdurFull(prison)}</b></div>${!juv&&openAt!==null?`<div class="stat"><span>KAPALI KURUM (TAHMİNİ)</span><b>${fdurFull(closedPart)}</b></div><div class="stat"><span>AÇIK KURUM (TAHMİNİ)</span><b>${fdurFull(openPart)}</b></div>`:''}<div class="stat"><span>TAHMİNİ DS SÜRESİ</span><b>${fdurFull(dsActual)}</b></div>${dateCards}</div>${timeline}<div class="reason"><b>Hesaplama açıklaması</b><br>${reasons.join('<br>')}<br>105/A uygulaması ayrıca açık kurum/çocuk eğitimevi statüsü, iyi hâl ve infaz hâkimi değerlendirmesine bağlıdır. Açık kuruma ayrılma idare ve gözlem kurulu kararına bağlıdır; yüksek güvenlikli kurum, disiplin cezası ve firar gibi hâller otomatik değerlendirilmez. Sonuç resmi müddetname değildir.</div>`)}</div>`;
  const result=document.getElementById('result');result.innerHTML=html;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function resetForm(){document.querySelectorAll('input').forEach(i=>{if(i.type==='checkbox')i.checked=false;else i.value=''});document.getElementById('crimeType').value='';const r=document.getElementById('result');r.classList.remove('show');r.innerHTML=''}
document.getElementById('secondRecidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('recidivist').checked=false});
document.getElementById('recidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('secondRecidivist').checked=false});