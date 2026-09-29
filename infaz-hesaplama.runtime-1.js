const DAY_YEAR=365,DAY_MONTH=30;
const dval=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
const toDays=(y,m,d)=>y*DAY_YEAR+m*DAY_MONTH+d;
function dur(days){days=Math.max(0,Math.round(days));const y=Math.floor(days/365);days%=365;const m=Math.floor(days/30);const d=days%30;return `${y} yıl ${m} ay ${d} gün`}
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
function child7593Exception(crime){return['kill','sexualBasic','sexualAggravated','drug188','organization'].includes(crime)}
function needsLegacyDsReview(crimeDate){return crimeDate&&crimeDate<=new Date('2023-07-31T23:59:59')}
function tenPercentRuleApplies(crimeDate){return crimeDate&&crimeDate>=new Date('2025-06-04T00:00:00')}
function pre6545TwoThirds(crime,crimeDate){return crimeDate&&crimeDate<new Date('2014-06-28T00:00:00')&&['sexualBasic','sexualAggravated','drug188'].includes(crime)}
function temporary6DsException(crime){return['kill','injury87','torture','sexualBasic','sexualAggravated','privacy','drug188','stateSecrets','terror'].includes(crime)}
function temporary6DsWindow(crime,crimeDate){return crimeDate&&crimeDate<=new Date('2020-03-30T23:59:59')&&!temporary6DsException(crime)?1095:365}
function removeUnsupportedSpecialFields(){['womanChild','age70','illness'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const wrapper=el.closest('label');if(wrapper)wrapper.remove();else el.remove()})}
removeUnsupportedSpecialFields();
function showUnsupported(title,text){const result=document.getElementById('result');result.innerHTML=`<div class="summary"><div class="eyebrow inline-style-2">OTOMATİK HESAP SINIRI</div><div class="rate">${title}</div></div><div class="reason"><b>Bu senaryoda kesin tarih üretilmedi.</b><br>${text}<br><br>Sonuç için müddetname, fiilî kurum süreleri ve uygulanacak geçiş hükümleri ayrıca incelenmelidir.</div>`;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'})}
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
  if(document.getElementById('recidivist').checked){
    showUnsupported('İlk tekerrür / 5275 m.108','İlk tekerrürde m.108/2 uyarınca koşullu salıverme süresine eklenecek miktar, tekerrüre esas alınan cezanın en ağırından fazla olamaz. Mevcut form tekerrüre esas önceki cezanın miktarını toplamadığından yalnızca 2/3 oranı uygulayarak kesin tarih üretmek güvenilir değildir.');return;
  }
  if(!child7593Exception(crime)&&birth&&start&&ageAtStart!==null&&ageAtStart<15){
    showUnsupported('7593 sayılı Kanun / 5275 m.107/5','İnfaza başlama tarihinde hükümlü 15 yaşını doldurmamış görünüyor. 5275 m.107/5 uyarınca 15 yaş dolduruluncaya kadar infaz kurumunda fiilen geçirilen bir gün iki gün olarak dikkate alınabilir. Form; fiilî kurumda kalış, kesinti ve nakil dönemlerini güvenilir biçimde modellemediğinden otomatik koşullu salıverilme tarihi üretilmemiştir.');return;
  }
  if(child&&!child7593Exception(crime)&&(!birth||!start)){
    showUnsupported('7593 sayılı Kanun / yaş verisi gerekli','Çocuk hükümlü senaryosunda 5275 m.107/5 kontrolü için doğum tarihi ile infaza başlama/cezaevine giriş tarihi birlikte gereklidir. Bu veriler olmadan 15 yaş öncesi kurum süresi güvenilir biçimde değerlendirilemez.');return;
  }
  let ratio=baseRatio(crime,child),reasons=[];
  if(pre6545TwoThirds(crime,crimeDate)){ratio=2/3;reasons.push('28.06.2014 öncesi suç için 5275 sayılı Kanunun geçici 6/4 hükmündeki 2/3 koşullu salıverilme oranı uygulandı.');}
  else reasons.push('Temel koşullu salıverilme oranı '+ratioLabel(ratio)+' olarak değerlendirildi.');
  if(document.getElementById('secondRecidivist').checked){ratio=Math.max(ratio,3/4);reasons.push('4.6.2025 değişikliği sonrası ikinci defa tekerrürde süreli hapis için 3/4 oranı dikkate alındı; m.108/2 sınırı ikinci tekerrürde uygulanmaz.')}
  const ksGross=Math.ceil(total*ratio),ksAfterCredit=Math.max(0,ksGross-credit),fullAfterCredit=Math.max(0,total-credit);
  if(needsLegacyDsReview(crimeDate)){
    const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
    const result=document.getElementById('result');
    const legacyWindow=temporary6DsWindow(crime,crimeDate);
    if(legacyWindow===1095)reasons.push('30.03.2020 ve öncesindeki, Geçici 6/1 istisnaları dışında kalan suçlarda 105/A bakımından üç yıllık özel pencere bulunduğu tespit edildi; ancak Geçici 10 ve sonraki geçiş hükümleri nedeniyle kesin DS tarihi otomatik üretilmedi.');
    result.innerHTML=`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Doğrulanabilen aritmetik</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${dur(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${dur(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${dur(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${dur(ksAfterCredit)}</b></div></div><div class="reason"><b>Denetimli serbestlik tarihi otomatik üretilmedi.</b><br>31.07.2023 ve öncesindeki suçlarda 5275 sayılı Kanunun geçici 6 ve geçici 10 hükümleri ile 25.12.2025 değişiklikleri; kurum türü, kurumda geçirilen süre ve istisna suçlar bakımından ayrıca değerlendirme gerektirir. Mevcut form bu verilerin tamamını toplamamaktadır.<br>${reasons.join('<br>')}</div>`;
    result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});return;
  }
  const dsWindow=365;
  let prison=Math.max(0,ksAfterCredit-dsWindow);
  if(tenPercentRuleApplies(crimeDate)){
    if(credit>0){showUnsupported('105/A %10 kurum süresi / mahsup ayrımı','4.6.2025 sonrası 105/A hesabında kurumda geçirilmesi gereken sürenin en az onda biri şartı vardır. Girilen mahsup süresinin hangi kısmının ceza infaz kurumunda fiilen geçirilmiş süre olduğu mevcut formdan anlaşılamadığından kesin denetimli serbestlik eşiği üretilmemiştir.');return;}
    const minInstitution=Math.max(5,Math.ceil(ksGross/10));
    prison=Math.max(prison,minInstitution);
    reasons.push('4.6.2025 sonrası suçlarda 105/A için en az 5 gün ve koşullu salıverilmeye kadar kurumda geçirilmesi gereken sürenin en az 1/10’u kontrolü uygulandı.');
  }
  const dsActual=Math.max(0,ksAfterCredit-prison);
  let dateCards='',timeline='';
  if(start){
    const dsDate=addDays(start,prison),ksDate=addDays(start,ksAfterCredit),fullDate=addDays(start,fullAfterCredit);
    dateCards=`<div class="stat highlight"><span>DENETİMLİ SERBESTLİK İÇİN ARİTMETİK EŞİK</span><b>${fmtDate(dsDate)}</b></div><div class="stat highlight"><span>KOŞULLU SALIVERİLME ARİTMETİK TARİHİ</span><b>${fmtDate(ksDate)}</b></div>`;
    timeline=`<h3 class="result-title">Aritmetik zaman çizelgesi</h3><div class="timeline"><div class="timeline-row"><span>İNFAZA BAŞLAMA</span><strong>${fmtDate(start)}</strong></div><div class="timeline-row"><span>DS ARİTMETİK EŞİĞİ</span><strong>${fmtDate(dsDate)}</strong></div><div class="timeline-row"><span>KS ARİTMETİK TARİHİ</span><strong>${fmtDate(ksDate)}</strong></div><div class="timeline-row"><span>BİHAKKIN ARİTMETİK TARİH</span><strong>${fmtDate(fullDate)}</strong></div></div>`;
  }
  const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
  const html=`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${ratioLabel(ratio)} koşullu salıverilme oranı</div><p>${crimeText}</p></div><h3 class="result-title">Süre parametreleri</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${dur(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${dur(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${dur(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${dur(ksAfterCredit)}</b></div><div class="stat"><span>TAHMİNİ KURUM SÜRESİ</span><b>${dur(prison)}</b></div><div class="stat"><span>TAHMİNİ DS SÜRESİ</span><b>${dur(dsActual)}</b></div>${dateCards}</div>${timeline}<div class="reason"><b>Hesaplama açıklaması</b><br>${reasons.join('<br>')}<br>105/A uygulaması ayrıca açık kurum/çocuk eğitimevi statüsü, iyi hâl ve infaz hâkimi değerlendirmesine bağlıdır. Açık kuruma ayrılma ve dosyaya özgü geçiş hükümleri otomatik kesinleştirilmez. Sonuç resmi müddetname değildir.</div>`;
  const result=document.getElementById('result');result.innerHTML=html;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function resetForm(){document.querySelectorAll('input').forEach(i=>{if(i.type==='checkbox')i.checked=false;else i.value=''});document.getElementById('crimeType').value='';const r=document.getElementById('result');r.classList.remove('show');r.innerHTML=''}
document.getElementById('secondRecidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('recidivist').checked=false});
document.getElementById('recidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('secondRecidivist').checked=false});