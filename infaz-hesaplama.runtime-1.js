const DAY_YEAR=365,DAY_MONTH=30;
const dval=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
const toDays=(y,m,d)=>y*DAY_YEAR+m*DAY_MONTH+d;
function fmtDate(dt){return new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(dt)}
function parseDate(v){return v?new Date(v+'T12:00:00'):null}
function selectedCrime(){return document.getElementById('crimeType').value}
function ageOn(birth,date){if(!birth||!date)return null;let a=date.getFullYear()-birth.getFullYear();const md=date.getMonth()-birth.getMonth();if(md<0||(md===0&&date.getDate()<birth.getDate()))a--;return a}
function ratioLabel(r){if(r>=.749)return'3/4';if(r>=.665)return'2/3';return'1/2'}
// Suç kataloğu. r: yetişkin KS oranı, rc: çocuk KS oranı (5275 m.107/2, 107/4, 108/9; 3713 m.17),
// open: açık kuruma ayrılma ek şartı (Yönetmelik m.6/2: f5 = KS'ye 5 yıldan az, t3 = 3 yıldan az; none = m.8/1-ç),
// ex5: doğrudan açık dışı (m.5), neg: taksirli (m.5/1-b), c7593: 5275 m.107/5 istisnası, t6: Geçici 6/1 istisnası,
// m: müebbette KS yılı [müebbet, ağırlaştırılmış] (107/2, 107/4, 108/9).
const CRIMES={
 general:{r:1/2,open:'g7'},theft141:{r:1/2,open:'g7'},theft142:{r:1/2,open:'f5'},robbery:{r:1/2,open:'f5'},fraud:{r:1/2,open:'g7'},
 injury86:{r:1/2,open:'g7'},injurySpouse:{r:1/2,open:'t3',t6:1},threat:{r:1/2,open:'g7'},insult:{r:1/2,open:'g7'},damage:{r:1/2,open:'g7'},
 liberty:{r:1/2,open:'g7'},dwelling:{r:1/2,open:'g7'},forgery:{r:1/2,open:'g7'},embezzle:{r:1/2,open:'g7'},cyber:{r:1/2,open:'g7'},
 traffic:{r:1/2,open:'g7'},weapon:{r:1/2,open:'g7'},smuggling:{r:1/2,open:'g7'},drug191:{r:1/2,open:'g7'},drug190:{r:1/2,open:'f5'},
 negligent:{r:1/2,open:'g7',neg:1},
 kill:{r:2/3,rc:2/3,open:'g7',c7593:1,t6:1},killSpouse:{r:2/3,rc:2/3,open:'t3',c7593:1,t6:1},injury87:{r:2/3,rc:2/3,open:'g7',t6:1},
 torture:{r:2/3,rc:2/3,open:'g7',t6:1},torment:{r:2/3,rc:2/3,open:'g7',t6:1},tormentSpouse:{r:2/3,rc:2/3,open:'t3',t6:1},
 sex102_1:{r:2/3,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1},sex104_1:{r:2/3,rc:2/3,open:'g7',ex5:1,t6:1,sex:1},sex105:{r:2/3,rc:2/3,open:'g7',ex5:1,t6:1,sex:1},
 privacy:{r:2/3,rc:2/3,open:'g7',t6:1},stateSecrets:{r:2/3,rc:2/3,open:'g7',t6:1},mit:{r:2/3,rc:2/3,open:'g7'},
 organization:{r:2/3,rc:2/3,open:'none',ex5:1,c7593:1,m:[30,36]},
 drug188:{r:3/4,rc:2/3,open:'f5',c7593:1,t6:1,m:[33,39],p6545:1},sex102_2:{r:3/4,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1,m:[33,39],p6545:1},
 sex103:{r:3/4,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1,m:[33,39],p6545:1},sex104_23:{r:3/4,rc:2/3,open:'g7',ex5:1,t6:1,sex:1,m:[33,39],p6545:1},
 terror:{r:3/4,rc:2/3,open:'none',ex5:1,t6:1,m:[30,36],noAggKs:1}
};
const crimeInfo=c=>CRIMES[c]||CRIMES.general;
function baseRatio(crime,child){const k=crimeInfo(crime);return child?(k.rc||1/2):k.r}
function child7593ClearException(crime){return!!crimeInfo(crime).c7593}
function child7593SexualNeedsExactArticle(){return false}
function pre6545TwoThirds(crime,crimeDate){return crimeDate&&crimeDate<new Date('2014-06-28T00:00:00')&&!!crimeInfo(crime).p6545}
function temporary6DsException(crime){return!!crimeInfo(crime).t6}
function needsLegacyDsReview(crimeDate){return crimeDate&&crimeDate<=new Date('2023-07-31T23:59:59')}
function tenPercentRuleApplies(crimeDate){return crimeDate&&crimeDate>=new Date('2025-06-04T00:00:00')}
function temporary6DsWindow(crime,crimeDate){return crimeDate&&crimeDate<=new Date('2020-03-30T23:59:59')&&!temporary6DsException(crime)?1095:365}
function removeUnsupportedSpecialFields(){['age70'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const wrapper=el.closest('label');if(wrapper)wrapper.remove();else el.remove()})}
removeUnsupportedSpecialFields();
function ratioWords(r){if(r>=.749)return'dörtte üçünü';if(r>=.665)return'üçte ikisini';return'yarısını'}
function plainUnsupportedReason(title){
  if(/tekerrür/i.test(title))return'Mükerrir (daha önce kesinleşmiş cezası olan) kişilerde hesap, önceki cezanın miktarına göre değişir. Mükerrir kutusunun altındaki alana tekerrüre esas önceki cezanın miktarını yazıp yeniden hesaplayın.';
  if(/Ağırlaştırılmış müebbet/i.test(title))return'Bu suçlarda ağırlaştırılmış müebbet hapis cezası hayat boyu çekilir; kanun koşullu salıverilmeye izin vermez.';
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
  const life=(document.getElementById('sentenceType')?.value||'sureli')!=='sureli';
  const total=toDays(dval('sentenceYear'),dval('sentenceMonth'),dval('sentenceDay'));if(!life&&total<=0){alert('Lütfen ceza miktarını giriniz.');return}
  const cd=parseDate(document.getElementById('crimeDate').value);if(!cd){alert('Suç tarihini giriniz. Geçiş hükümleri nedeniyle suç tarihi zorunludur.');return}
  const birth=parseDate(document.getElementById('birthDate').value),childBox=document.getElementById('childOffender').checked;
  const crimeAge=ageOn(birth,cd);
  if(birth&&birth>cd){alert('Doğum tarihi suç tarihinden sonra olamaz.');return}
  if(life&&childBox){alert('Suç tarihinde 18 yaşından küçük olanlara müebbet hapis cezası verilemez (TCK m.31). Lütfen cezanın türünü ve miktarını kontrol ediniz.');return}
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
function performCalculation(crime,totalDays,crimeDate){
  const sentType=document.getElementById('sentenceType')?.value||'sureli',life=sentType!=='sureli',agg=sentType==='agir',K=crimeInfo(crime);
  const total=life?0:dur3(dval('sentenceYear'),dval('sentenceMonth'),dval('sentenceDay'));
  const totalLabel=life?(agg?'Ağırlaştırılmış müebbet hapis':'Müebbet hapis'):fdur(total);
  const credit=dur3(dval('creditYear'),dval('creditMonth'),dval('creditDay')),hasCredit=U(credit)>0;
  const child=document.getElementById('childOffender').checked,secondRec=document.getElementById('secondRecidivist').checked;
  const birth=parseDate(document.getElementById('birthDate').value),start=parseDate(document.getElementById('startDate').value);
  const ageAtStart=ageOn(birth,start);
  if(start&&crimeDate&&start<crimeDate){showStartBeforeCrime(start,crimeDate);return}
  if(start&&hasCredit&&crimeDate&&at(start,credit,-1)<crimeDate){showCreditConflict(credit,start,crimeDate);return}
  const rec=document.getElementById('recidivist').checked,prev=dur3(dval('prevYear'),dval('prevMonth'),dval('prevDay'));
  if(rec&&U(prev)<=0){showUnsupported('İlk tekerrür / 5275 m.108','İlk tekerrürde m.108/2 uyarınca koşullu salıverme süresine eklenecek miktar, tekerrüre esas alınan cezanın en ağırından fazla olamaz. Bu nedenle tekerrüre esas önceki cezanın miktarı girilmeden kesin tarih üretilmez.');return}
  if(life&&agg&&K.noAggKs){showUnsupported('Ağırlaştırılmış müebbet / 5275 m.107/16, 3713 m.17','Terör suçlarından veya örgüt faaliyeti çerçevesinde işlenen devletin güvenliğine, anayasal düzene ve millî savunmaya karşı suçlardan ağırlaştırılmış müebbet hapis cezasına mahkûmiyette koşullu salıverilme hükümleri uygulanmaz; ceza hayat boyu çekilir.');return}
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
  let ksGross,recAdd=0,lifeYears=0;
  if(life){
    const baseY=K.m?K.m[agg?1:0]:(agg?30:24),recY=agg?39:33;
    lifeYears=secondRec?Math.max(baseY,recY):baseY;ksGross=lifeYears*365;
    if(rec&&recY>baseY){recAdd=Math.min((recY-baseY)*365,prev);ksGross+=recAdd}
    reasons.push((agg?'Ağırlaştırılmış müebbet':'Müebbet')+' hapiste koşullu salıverilme için kurumda geçirilmesi gereken süre '+lifeYears+' yıl olarak alındı (5275 m.107/2, 107/4, 108; 3713 m.17).'+(recAdd?' İlk tekerrür nedeniyle '+fdurFull(recAdd)+' eklendi (m.108/2 sınırı).':''));
  }else{
    ksGross=frac(total,ratio);
    if(rec&&!secondRec){const r2=frac(total,Math.max(2/3,ratio));recAdd=Math.min(dsub(r2,ksGross),prev);ksGross+=recAdd;reasons.push('İlk tekerrür: 5275 m.108/1-d uyarınca 2/3 oranı esas alındı; m.108/2 uyarınca eklenen süre ('+fdurFull(recAdd)+') tekerrüre esas cezanın en ağırını aşamaz.')}
  }
  const ksNet=dsub(ksGross,credit),fullNet=life?null:dsub(total,credit);
  const ksLine=life?`<li>${agg?'Ağırlaştırılmış müebbet':'Müebbet'} hapiste koşullu salıverilme için cezaevinde geçirilmesi gereken süre: <b>${lifeYears} yıl</b>${hasCredit?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`:null;
  const recLi=recAdd?`<li>Mükerrir olduğu için bu süreye <b>${fdur(recAdd)}</b> eklendi; eklenen süre önceki cezanın en ağırını aşamaz. Toplam: <b>${fdur(ksGross)}</b>${hasCredit?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`:'';
  const crimeText=document.getElementById('crimeType').options[document.getElementById('crimeType').selectedIndex].text;
  const when=t=>start?fmtDate(at(start,t)):null;
  // Açık ceza infaz kurumu (Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği m.5, 6, 7, 8)
  const ageAtExec=ageOn(birth,start||new Date()),adultAtExec=child&&ageAtExec!==null&&ageAtExec>=18,juv=child&&!adultAtExec;
  if(adultAtExec)reasons.push('Suç tarihinde çocuk olan hükümlü infaza '+(start?'başlama tarihinde':'bugün itibarıyla')+' 18 yaşını doldurmuş görünüyor; koşullu salıverilme oranı suç tarihindeki yaşa göre belirlendi, kurum ve açık kuruma ayrılma kuralları yetişkin hükümlüler gibi uygulandı.');
  const noOpen=!juv&&(K.open==='none'||(life&&agg));
  const directOpen=!life&&!juv&&!noOpen&&!K.ex5&&!secondRec&&(total<=1095||(K.neg&&total<=1825));
  const closedMin=life?0:(total>=3650?frac(total,1/10):30);
  const beforeKs=(years,strict)=>{const raw=ksNet-years*365;return raw<0?0:(strict?raw+1:raw)};
  let openAt=null,openLi='';
  if(!juv&&!noOpen){
    if(directOpen){openAt=0;openLi=total>1095?'<li>Taksirli suçlarda toplam cezası 5 yıl veya daha az olan hükümlüler cezaya doğrudan açık cezaevinde başlar.</li>':'<li>Kasıtlı suçlarda toplam cezası 3 yıl veya daha az olan hükümlüler (terör, örgüt ve cinsel suçlar ile ikinci kez mükerrirler hariç) cezaya doğrudan açık cezaevinde başlar.</li>'}
    else{
      let lim=life?{y:5,s:false}:{y:7,s:false};
      if(K.open==='f5')lim={y:5,s:true};
      if(K.open==='t3')lim={y:3,s:true};
      openAt=dmax(closedMin,beforeKs(lim.y,lim.s));
      openLi=`<li>Açık cezaevine geçmek için ${life?'':(total>=3650?'cezanın onda biri':'en az 1 ay')+' kapalı cezaevinde geçirilmeli ve '}${K.open==='f5'||K.open==='t3'?'bu suç türünde ':''}koşullu salıverilmeye <b>${lim.y} yıl${lim.s?'dan az':' veya daha az'}</b> kalmış olmalıdır.</li>`;
    }
    if(U(openAt)>U(ksNet))openAt=ksNet;
    reasons.push('Açık kuruma ayrılma: Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği m.5 ve m.6 (4.6.2025 değişiklikli hâli). Kapalı kurumda geçirilmesi gereken süre ihtiyatlı biçimde infaza başlama tarihinden itibaren sayıldı; tutukluluk süresi kurumda geçmiş sayılırsa açığa ayrılma daha erken olabilir.');
  }
  if(noOpen)reasons.push(agg?'Ağırlaştırılmış müebbet hapis cezasına mahkûm olanlar Yönetmelik m.8/1-a uyarınca açık kuruma ayrılamaz. 105/A denetimli serbestliği açık kurumda bulunmayı gerektirdiğinden DS tarihi üretilmedi.':'Terör ve örgütlü suçlardan hükümlüler Yönetmelik m.8/1-ç uyarınca açık kuruma ayrılamaz (m.6/2-c ve ç istisnaları hariç). 105/A denetimli serbestliği açık kurumda veya çocuk eğitimevinde bulunmayı gerektirdiğinden DS tarihi üretilmedi.');
  const noOpenTxt=agg?'Ağırlaştırılmış müebbet hapis cezasında açık cezaevine geçilemediği için denetimli serbestlikle erken çıkış uygulanmaz.':'Terör ve örgüt suçlarında kural olarak açık cezaevine geçilemediği için denetimli serbestlikle erken çıkış uygulanmaz. Örgütten ayrıldığı cezaevi kurulunca tespit edilen hükümlü koşullu salıverilmeye 1 yıldan az kala, etkin pişmanlıktan (TCK 221) yararlanan hükümlü 2 yıldan az kala açık cezaevine geçebilir; bu durumda denetimli serbestlik gündeme gelebilir.';
  const adultLi=adultAtExec?`<li>Suç tarihinde 18 yaşından küçük olduğu için koşullu salıverilme oranı çocuklara göre uygulanır. Ancak cezaevine girdiğinde 18 yaşını doldurmuş olacağı için çocuk eğitimevine değil yetişkin (gençlik) kurumlarına alınır; açık cezaevine geçiş kuralları buna göre uygulanır.</li>`:'';
  const childLi=adultLi||(juv?`<li>Çocuk hükümlüler cezalarını kural olarak çocuk eğitimevinde çeker. Çocuk eğitimevindeyken 18 yaşını bitiren (eğitime devam ediyorsa 21 yaşını bitiren) hükümlü, suç türüne bakılmaksızın açık cezaevine gönderilir${birth?` (18 yaşını bitirdiği tarih: <b>${fmtDate(new Date(birth.getFullYear()+18,birth.getMonth(),birth.getDate(),12))}</b>)`:''}.</li>`:'');
  if(needsLegacyDsReview(crimeDate)){
    const result=document.getElementById('result');
    const legacyWindow=temporary6DsWindow(crime,crimeDate);
    if(legacyWindow===1095)reasons.push('30.03.2020 ve öncesindeki, Geçici 6/1 istisnaları dışında kalan suçlarda 105/A bakımından üç yıllık özel pencere bulunduğu tespit edildi; ancak Geçici 10 ve sonraki geçiş hükümleri nedeniyle kesin DS tarihi otomatik üretilmedi.');
    const ksDateL=when(ksNet);
    const openLegacy=openAt!==null&&!directOpen&&U(openAt)>0?`<li>Açık cezaevine geçiş için ${start?'tahmini en erken tarih':'kapalı cezaevinde geçecek tahmini süre'}: <b>${start?when(openAt):fdur(openAt)}</b></li>`:'';
    result.innerHTML=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${ksDateL?`<p class="plain-big">Koşullu salıverilme için tahmini tarih: <b>${ksDateL}</b></p>`:`<p class="plain-big">Koşullu salıverilmeye kadar geçmesi gereken süre: <b>${fdur(ksNet)}</b></p>`}<p class="plain-sub">Suç 31 Temmuz 2023 veya öncesinde işlendiği için, denetimli serbestlikle cezaevinden ne zaman çıkılabileceği geçiş hükümlerine bağlıdır ve bu araçla otomatik hesaplanmıyor. Denetimli serbestlik tarihi bu tarihten <b>daha önce</b> olur.</p>${ksDateL?'':'<p class="plain-sub">Tarih görmek için yukarıya cezaevine giriş tarihini yazın.</p>'}</div><div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${totalLabel}</b></li>${hasCredit?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${fdur(credit)}</b></li>`:''}${ksLine||`<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${fdur(ksGross-recAdd)}</b></li>`}${recLi}${hasCredit?`<li>Düşülen süre çıkarıldıktan sonra kalan: <b>${fdur(ksNet)}</b></li>`:''}${directOpen?openLi:openLegacy?openLi+openLegacy:''}${noOpen?`<li>${agg?'Ağırlaştırılmış müebbet hapis cezasında':'Terör ve örgüt suçlarında kural olarak'} açık cezaevine geçilemez.</li>`:''}${childLi}</ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${life?lifeYears+' yıl koşullu salıverilme süresi':ratioLabel(ratio)+' koşullu salıverilme oranı'}</div><p>${crimeText}</p></div><h3 class="result-title">Doğrulanabilen aritmetik</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${life?totalLabel:fdurFull(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${fdurFull(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${fdurFull(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${fdurFull(ksNet)}</b></div></div><div class="reason"><b>Denetimli serbestlik tarihi otomatik üretilmedi.</b><br>31.07.2023 ve öncesindeki suçlarda 5275 sayılı Kanunun geçici 6 ve geçici 10 hükümleri ile 25.12.2025 değişiklikleri; kurum türü, kurumda geçirilen süre ve istisna suçlar bakımından ayrıca değerlendirme gerektirir. Mevcut form bu verilerin tamamını toplamamaktadır.<br>${reasons.join('<br>')}</div>`)}</div>`;
    result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});return;
  }
  const womanChild=document.getElementById('womanChild')?.checked,illness=document.getElementById('illness')?.checked;
  const dsWindow=illness?1095:womanChild?730:365;
  if(dsWindow>365)reasons.push('5275 m.105/A-3 uyarınca '+(illness?'ağır hastalık, engellilik veya kocama nedeniyle hayatını yalnız idame ettiremeyen hükümlüde 3 yıllık':'0-6 yaş grubunda çocuğu bulunan kadın hükümlüde 2 yıllık')+' denetimli serbestlik süresi uygulandı.');
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
    timeline=`<h3 class="result-title">Aritmetik zaman çizelgesi</h3><div class="timeline"><div class="timeline-row"><span>İNFAZA BAŞLAMA</span><strong>${fmtDate(start)}</strong></div>${openAt!==null&&U(openAt)>0?`<div class="timeline-row"><span>AÇIK KURUMA AYRILMA</span><strong>${when(openAt)}</strong></div>`:''}${noOpen?'':`<div class="timeline-row"><span>DS ARİTMETİK EŞİĞİ</span><strong>${when(prison)}</strong></div>`}<div class="timeline-row"><span>KS ARİTMETİK TARİHİ</span><strong>${when(ksNet)}</strong></div><div class="timeline-row"><span>${life?'DENETİM SÜRESİ SONU':'BİHAKKIN ARİTMETİK TARİH'}</span><strong>${when(life?dadd(ksNet,ksGross):fullNet)}</strong></div></div>`;
  }
  const b18=birth?new Date(birth.getFullYear()+18,birth.getMonth(),birth.getDate(),12):null;
  const juvOpen=juv&&start&&b18&&b18>start&&b18<at(start,prison);
  const steps=[];
  if(start){
    if(noOpen){
      steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(ksNet)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdur(ksNet)}</b> kapalı cezaevinde kalınır. ${agg?'Ağırlaştırılmış müebbet hapis cezasında':'Terör ve örgüt suçlarında kural olarak'} açık cezaevine geçilemez; bu yüzden denetimli serbestlik de uygulanmaz.</p></li>`);
    }else if(juv){
      if(juvOpen){
        steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${fmtDate(b18)}</span><strong>Çocuk eğitimevi</strong><p>18 yaşını bitirene kadar yaklaşık <b>${fdurAbout(between(start,b18))}</b> çocuk eğitimevinde kalınır.</p></li>`);
        steps.push(`<li><span class="ps-when">${fmtDate(b18)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>18 yaşını bitirince suç türüne bakılmaksızın açık cezaevine gönderilir; eğitime devam ediyorsa bu 21 yaşını bitirince olur. Yaklaşık <b>${fdurAbout(between(b18,at(start,prison)))}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
      }else steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(prison)}</span><strong>Çocuk eğitimevi</strong><p>Yaklaşık <b>${fdur(prison)}</b> çocuk eğitimevinde kalınır.</p></li>`);
    }else{
      if(!directOpen&&U(closedPart)>0)steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(closedPart)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdurAbout(closedPart)}</b> kapalı cezaevinde kalınır. Açık cezaevine geçmek için iyi hâlli olmak ve cezaevi idaresinin kararı gerekir.</p></li>`);
      if(U(openPart)>0||directOpen)steps.push(`<li><span class="ps-when">${when(openAt)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>${directOpen?'Ceza 3 yıl veya daha az olduğu için doğrudan açık cezaevine alınır. ':''}Yaklaşık <b>${fdurAbout(openPart)}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
    }
    if(!noOpen)steps.push(`<li><span class="ps-when">${when(prison)} → ${when(ksNet)}</span><strong>Denetimli serbestlik</strong><p>Yaklaşık <b>${fdur(dsActual)}</b> dışarıda, imza ve kurallara uyarak geçirilir. Kurallara uyulmazsa cezaevine geri dönülebilir.</p></li>`);
    steps.push(`<li><span class="ps-when">${when(ksNet)}</span><strong>Koşullu salıverilme</strong><p>${life?`Cezaevinden çıkılır. Ardından <b>${fdur(ksGross)}</b> denetim süresi başlar (5275 m.107/6); bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.`:'Cezaevi ile ilişki sona erer. Ancak cezanın asıl bitiş tarihine kadar “denetim süresi” devam eder; bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.'}</p></li>`);
    steps.push(life?`<li><span class="ps-when">${when(dadd(ksNet,ksGross))}</span><strong>Denetim süresinin bitmesi</strong><p>Denetim süresi kurallara uyularak geçirilirse ceza infaz edilmiş sayılır (5275 m.107/14).</p></li>`:`<li><span class="ps-when">${when(fullNet)}</span><strong>Cezanın tamamen bitmesi</strong><p>Mahkemenin verdiği cezanın tamamı dolar.</p></li>`);
  }
  let head;
  if(noOpen){
    head=`<p class="plain-big">${start?`Koşullu salıverilme için tahmini tarih: <b>${when(ksNet)}</b>`:`Koşullu salıverilmeye kadar cezaevinde kalınacak tahmini süre: <b>${fdur(ksNet)}</b>`}</p><p class="plain-sub">${noOpenTxt}</p>`;
  }else{
    head=`${start?(U(prison)>0?`<p class="plain-big">En erken <b>${when(prison)}</b> tarihinde denetimli serbestlikle cezaevinden çıkış mümkün olabilir.</p>`:`<p class="plain-big">Hesaba göre cezaevinde kalınacak süre çok kısa; denetimli serbestlik değerlendirmesi hemen gündeme gelebilir.</p>`):`<p class="plain-big">Cezaevinde kalınacak tahmini süre: <b>${fdur(prison)}</b></p>`}${!juv&&openAt!==null&&U(prison)>0?`<p class="plain-sub">Bu sürenin ${directOpen?'tamamı açık cezaevinde geçer.':U(openPart)>0?`yaklaşık <b>${fdurAbout(closedPart)}</b> kısmı kapalı, <b>${fdurAbout(openPart)}</b> kısmı açık cezaevinde geçer.`:'tamamı kapalı cezaevinde geçer.'}</p>`:''}${juvOpen?`<p class="plain-sub">Bu sürenin yaklaşık <b>${fdurAbout(between(start,b18))}</b> kısmı çocuk eğitimevinde, <b>${fdurAbout(between(b18,at(start,prison)))}</b> kısmı açık cezaevinde geçer.</p>`:''}<p class="plain-sub">${start&&U(prison)>0?'Bu tarihten':'Bu süreden'} sonra cezanın kalanı dışarıda, imza ve kurallara uyma gibi yükümlülüklerle geçirilir. Bunun için cezaevinde iyi hâlli olmak ve infaz hâkiminin onayı gerekir.</p>${prisonEarly!==null?`<p class="plain-sub">Tutuklulukta cezaevinde geçen süre de hesaba katılırsa ${U(prisonEarly)===0?'denetimli serbestlik hemen gündeme gelebilir.':start?`çıkış tarihi öne gelebilir (en erken: <b>${when(prisonEarly)}</b>).`:`cezaevinde kalınacak süre kısalabilir (en kısa: <b>${fdur(prisonEarly)}</b>).`}</p>`:''}`;
  }
  const html=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${head}${start?'':'<p class="plain-sub"><b>Tarihleri görmek için yukarıya cezaevine giriş tarihini yazın.</b></p>'}</div>${steps.length?`<ol class="plain-steps">${steps.join('')}</ol>`:''}<div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>Mahkemenin verdiği ceza: <b>${totalLabel}</b></li>${hasCredit?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${fdur(credit)}</b></li>`:''}${ksLine||`<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${fdur(ksGross-recAdd)}</b>${hasCredit&&!recAdd?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`}${recLi}${openLi}${noOpen?'':`<li>Bu sürenin koşullu salıverilmeden önceki son kısmı (en fazla ${fdur(dsWindow)}) denetimli serbestlikle dışarıda geçirilebilir: <b>${fdur(dsActual)}</b></li>${tenLi}<li>${tenLi?'Bu nedenle cezaevinde geçirilecek süre':'Geriye kalan kısım cezaevinde geçirilir'}: <b>${fdur(prison)}</b></li>`}${noOpen?`<li>${agg?'Ağırlaştırılmış müebbet hapis cezasına mahkûm olanlar':'Terör ve örgüt suçlarından hükümlüler'} kural olarak açık cezaevine geçemez; denetimli serbestlik için açık cezaevinde bulunmak gerekir.</li>`:''}${childLi}</ul></div>${creditNote(credit,start)}${plainWarn()}${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${life?lifeYears+' yıl koşullu salıverilme süresi':ratioLabel(ratio)+' koşullu salıverilme oranı'}</div><p>${crimeText}</p></div><h3 class="result-title">Süre parametreleri</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${life?totalLabel:fdurFull(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${fdurFull(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${fdurFull(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${fdurFull(ksNet)}</b></div><div class="stat"><span>TAHMİNİ KURUM SÜRESİ</span><b>${fdurFull(prison)}</b></div>${!juv&&openAt!==null?`<div class="stat"><span>KAPALI KURUM (TAHMİNİ)</span><b>${fdurFull(closedPart)}</b></div><div class="stat"><span>AÇIK KURUM (TAHMİNİ)</span><b>${fdurFull(openPart)}</b></div>`:''}<div class="stat"><span>TAHMİNİ DS SÜRESİ</span><b>${fdurFull(dsActual)}</b></div>${dateCards}</div>${timeline}<div class="reason"><b>Hesaplama açıklaması</b><br>${reasons.join('<br>')}<br>105/A uygulaması ayrıca açık kurum/çocuk eğitimevi statüsü, iyi hâl ve infaz hâkimi değerlendirmesine bağlıdır. Açık kuruma ayrılma idare ve gözlem kurulu kararına bağlıdır; yüksek güvenlikli kurum, disiplin cezası ve firar gibi hâller otomatik değerlendirilmez. Sonuç resmi müddetname değildir.</div>`)}</div>`;
  const result=document.getElementById('result');result.innerHTML=html;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function resetForm(){document.querySelectorAll('input').forEach(i=>{if(i.type==='checkbox')i.checked=false;else i.value=''});document.getElementById('crimeType').value='';const st=document.getElementById('sentenceType');if(st)st.value='sureli';if(typeof syncSentenceType==='function'){syncSentenceType();syncRecidivist()}const r=document.getElementById('result');r.classList.remove('show');r.innerHTML=''}
document.getElementById('secondRecidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('recidivist').checked=false});
document.getElementById('recidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('secondRecidivist').checked=false});
function syncSentenceType(){const life=(document.getElementById('sentenceType')?.value||'sureli')!=='sureli';const w=document.getElementById('sentenceWrap');if(w)w.hidden=life}
function syncRecidivist(){const w=document.getElementById('prevWrap');if(w)w.hidden=!document.getElementById('recidivist').checked}
document.getElementById('sentenceType')?.addEventListener('change',syncSentenceType);
document.getElementById('recidivist').addEventListener('change',syncRecidivist);
document.getElementById('secondRecidivist').addEventListener('change',syncRecidivist);
syncSentenceType();syncRecidivist();
