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
// g10x: Geçici 10/6 (31.7.2023 ve öncesi suçlarda 3 yıl erken açık/DS) istisnası,
// g62x: Geçici 6/2 istisnası, negKill: taksirle öldürme (5275 m.110/1 dışı), sex: cinsel suç (m.110/9-b), m: müebbette KS yılı [müebbet, ağırlaştırılmış] (107/2, 107/4, 108/9).
const CRIMES={
 general:{r:1/2,open:'g7'},theft141:{r:1/2,open:'g7'},theft142:{r:1/2,open:'f5'},robbery:{r:1/2,open:'f5'},fraud:{r:1/2,open:'g7'},
 injury86:{r:1/2,open:'g7'},injurySpouse:{r:1/2,open:'t3',t6:1},injuryFamily:{r:1/2,open:'g7',t6:1},threat:{r:1/2,open:'g7'},insult:{r:1/2,open:'g7'},damage:{r:1/2,open:'g7'},
 liberty:{r:1/2,open:'g7'},dwelling:{r:1/2,open:'g7'},forgery:{r:1/2,open:'g7'},embezzle:{r:1/2,open:'g7'},cyber:{r:1/2,open:'g7'},
 traffic:{r:1/2,open:'g7'},weapon:{r:1/2,open:'g7'},smuggling:{r:1/2,open:'g7'},drug191:{r:1/2,open:'g7'},drug190:{r:1/2,open:'f5'},
 negligent:{r:1/2,open:'g7',neg:1},negKill:{r:1/2,open:'g7',neg:1,negKill:1},quakeDeath:{r:1/2,open:'g7',neg:1,negKill:1,g10x:1},stateSecurity:{r:1/2,rc:1/2,open:'g7',t6:1,g10x:1,g62x:1},
 kill:{g62x:1,r:2/3,rc:2/3,open:'g7',c7593:1,t6:1},killSpouse:{g62x:1,r:2/3,rc:2/3,open:'t3',c7593:1,t6:1,g10x:1},killFamily:{g62x:1,r:2/3,rc:2/3,open:'g7',c7593:1,t6:1,g10x:1},killChild:{g62x:1,r:2/3,rc:2/3,open:'g7',c7593:1,t6:1,g10x:1},injury87:{r:2/3,rc:2/3,open:'g7',t6:1},
 torture:{r:2/3,rc:2/3,open:'g7',t6:1},torment:{r:2/3,rc:2/3,open:'g7',t6:1},tormentSpouse:{r:2/3,rc:2/3,open:'t3',t6:1},
 sex102_1:{g62x:1,r:2/3,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1,g10x:1},sex104_1:{g62x:1,r:2/3,rc:2/3,open:'g7',ex5:1,t6:1,sex:1},sex105:{g62x:1,r:2/3,rc:2/3,open:'g7',ex5:1,t6:1,sex:1},
 privacy:{g62x:1,r:2/3,rc:2/3,open:'g7',t6:1},stateSecrets:{g62x:1,r:2/3,rc:2/3,open:'g7',t6:1,g10x:1},mit:{r:2/3,rc:2/3,open:'g7'},
 organization:{r:2/3,rc:2/3,open:'none',ex5:1,c7593:1,g10x:1,m:[30,36]},
 drug188:{r:3/4,rc:2/3,open:'f5',c7593:1,t6:1,m:[33,39],p6545:1},sex102_2:{g62x:1,r:3/4,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1,g10x:1,m:[33,39],p6545:1},
 sex103:{g62x:1,r:3/4,rc:2/3,open:'t3',ex5:1,c7593:1,t6:1,sex:1,g10x:1,m:[33,39],p6545:1},sex104_23:{g62x:1,r:3/4,rc:2/3,open:'g7',ex5:1,t6:1,sex:1,g10x:1,m:[33,39],p6545:1},
 terror:{g62x:1,r:3/4,rc:2/3,open:'none',ex5:1,t6:1,g10x:1,m:[30,36],noAggKs:1}
};
const crimeInfo=c=>CRIMES[c]||CRIMES.general;
function baseRatio(crime,child){const k=crimeInfo(crime);return child?(k.rc||1/2):k.r}
function child7593ClearException(crime){return!!crimeInfo(crime).c7593}
// 7593 sayılı Kanunla 107/5'e eklenen istisnalar 18.8.2026'da yürürlüğe girdi; koşullu salıverilmeye ilişkin aleyhe hükümler önceki suçlara uygulanmaz (TCK m.7/3).
const C7593_FROM=new Date('2026-08-18T00:00:00');
function c7593Applies(k,date){return!!k.c7593&&!!date&&date>=C7593_FROM}
function child7593SexualNeedsExactArticle(){return false}
function pre6545TwoThirds(crime,crimeDate){return crimeDate&&crimeDate<new Date('2014-06-28T00:00:00')&&!!crimeInfo(crime).p6545}
function temporary6DsException(crime){return!!crimeInfo(crime).t6}
function needsLegacyDsReview(crimeDate){return crimeDate&&crimeDate<=new Date('2023-07-31T23:59:59')}
function tenPercentRuleApplies(crimeDate){return crimeDate&&crimeDate>=new Date('2025-06-04T00:00:00')}
function temporary6DsWindow(crime,crimeDate){return crimeDate&&crimeDate<=new Date('2020-03-30T23:59:59')&&!temporary6DsException(crime)?1095:365}
function removeUnsupportedSpecialFields(){[].forEach(id=>{const el=document.getElementById(id);if(!el)return;const wrapper=el.closest('label');if(wrapper)wrapper.remove();else el.remove()})}
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
function showCheck(big,sub,items){const result=document.getElementById('result');result.innerHTML=`<div class="plain"><div class="plain-head plain-head--warn"><span class="plain-kicker">KONTROL EDİN</span><p class="plain-big">${big}</p><p class="plain-sub">${sub}</p></div><div class="plain-why"><h4>Ne yapmalısınız?</h4><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul></div></div>`;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'})}
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
function frac(t,r){return Math.floor(t*r+1e-9)} // TCK 61/6: bir günün artakalanı hesaba katılmaz (hükümlü lehine)
function at(start,t,sign=1){const x=new Date(start);x.setDate(x.getDate()+sign*Math.round(t));return x}
function ymd(t){t=Math.max(0,Math.round(t));const y=Math.floor(t/365),r=t%365;return[y,Math.floor(r/30),r%30]}
function fdur(t){const[y,m,d]=ymd(t),p=[];if(y)p.push(y+' yıl');if(m)p.push(m+' ay');if(d)p.push(d+' gün');return p.length?p.join(' '):'0 gün'}
function fdurAbout(t){let[y,m,d]=ymd(t);if(d<=2)d=0;else if(d>=28){d=0;m++}if(m>=12){y++;m-=12}const p=[];if(y)p.push(y+' yıl');if(m)p.push(m+' ay');if(d)p.push(d+' gün');return p.length?p.join(' '):'0 gün'}
function between(a,b){return Math.max(0,Math.round((b-a)/864e5))}
function fdurFull(t){const[y,m,d]=ymd(t);return`${y} yıl ${m} ay ${d} gün (${Math.round(t)} gün)`}
function performCalculation(crime,totalDays,crimeDate){
  const sentType=document.getElementById('sentenceType')?.value||'sureli',life=sentType!=='sureli',agg=sentType==='agir';let K=crimeInfo(crime);
  let total=life?0:dur3(dval('sentenceYear'),dval('sentenceMonth'),dval('sentenceDay'));
  const extras=readExtraSentences(),multi=extras.length>0;
  const totalLabel=life?(agg?'Ağırlaştırılmış müebbet hapis':'Müebbet hapis'):fdur(total);
  const manualCredit=dur3(dval('creditYear'),dval('creditMonth'),dval('creditDay'));let credit=manualCredit;
  const child=document.getElementById('childOffender').checked,secondRec=document.getElementById('secondRecidivist').checked;
  const birth=parseDate(document.getElementById('birthDate').value),start=parseDate(document.getElementById('startDate').value);
  const ageAtStart=ageOn(birth,start);
  if(start&&crimeDate&&start<crimeDate){showStartBeforeCrime(start,crimeDate);return}
  if(start&&manualCredit>0&&crimeDate&&at(start,manualCredit,-1)<crimeDate){showCreditConflict(manualCredit,start,crimeDate);return}
  for(const [n,r] of [...document.querySelectorAll('#extraSentences .extra-row')].entries()){const v=k=>r.querySelector(k).value,crimeV=v('.x-crime'),dateV=v('.x-date'),amt=dur3(...['.x-y','.x-m','.x-d'].map(k=>Math.max(0,Number(v(k))||0)));
    if(!crimeV&&!dateV&&!amt)continue;
    if(!crimeV||!dateV||!amt){showCheck(`${n+2}. ceza eksik doldurulmuş.`,`Eklenen ${n+2}. cezada ${[!crimeV&&'suç türü',!dateV&&'suç tarihi',!amt&&'ceza miktarı'].filter(Boolean).join(', ')} boş. Suç tarihi, hangi geçiş hükümlerinin uygulanacağını belirlediği için zorunludur.`,['Eksik alanları doldurun veya bu cezayı “Kaldır” düğmesiyle silin.']);return}
    const xd=parseDate(dateV);if(birth&&xd<birth){showCheck(`${n+2}. cezanın suç tarihi doğum tarihinden önce.`,`${n+2}. ceza için suç tarihi <b>${fmtDate(xd)}</b>, doğum tarihi <b>${fmtDate(birth)}</b> yazılmış.`,['Tarihleri kontrol edin.']);return}
  }
  for(const r of document.querySelectorAll('.period-row')){const f=r.querySelector('.p-from').value,t=r.querySelector('.p-to').value;if(!!f!==!!t){showCheck('Tutukluluk döneminin bir tarihi eksik.',`Tarihle eklenen dönemde ${f?'tahliye (çıkış)':'gözaltı / tutuklama (giriş)'} tarihi boş.`,['İki tarihi de yazın veya dönemi “Kaldır” düğmesiyle silin.','Kişi hâlâ içerideyse dönem eklemeyin; tutuklandığı günü cezaevine giriş tarihi olarak yazın.']);return}}
  const periods=readPeriods();let periodDays=0;
  for(const pr of periods){
    if(pr.to<pr.from){showCheck('Tutukluluk dönemi tarihleri hatalı.',`Bir dönemde çıkış tarihi (<b>${fmtDate(pr.to)}</b>) giriş tarihinden (<b>${fmtDate(pr.from)}</b>) önce yazılmış.`,['Dönemin giriş (gözaltı veya tutuklama) ve çıkış (tahliye) tarihlerini kontrol edin.']);return}
    if(crimeDate&&pr.from<crimeDate){showCheck('Tutukluluk dönemi suç tarihinden önce başlıyor.',`Dönem <b>${fmtDate(pr.from)}</b> tarihinde başlıyor, suç tarihi ise <b>${fmtDate(crimeDate)}</b>. Bu suç için suçtan önce tutuklanılmış olamaz.`,['Dönem tarihlerini ve suç tarihini kontrol edin.']);return}
    if(start&&pr.to>=start){showCheck('Tutukluluk dönemi cezaevine giriş tarihiyle çakışıyor.',`Dönem <b>${fmtDate(pr.to)}</b> tarihinde bitiyor; cezaevine giriş tarihi ise <b>${fmtDate(start)}</b>. Aynı günler iki kez düşülür.`,['Kişi tutuklandığı günden beri kesintisiz içerideyse: dönemi silin ve cezaevine giriş tarihine tutuklandığı günü yazın.','Tahliye edilip sonra yeniden girdiyse: dönemin çıkış tarihi, yeniden giriş tarihinden önce olmalıdır.']);return}
    periodDays+=between(pr.from,pr.to)+1;
  }
  {const ps=[...periods].sort((a,b)=>a.from-b.from);for(let i=1;i<ps.length;i++)if(ps[i].from<=ps[i-1].to){showCheck('Tutukluluk dönemleri birbiriyle çakışıyor.',`<b>${fmtDate(ps[i-1].from)} – ${fmtDate(ps[i-1].to)}</b> ve <b>${fmtDate(ps[i].from)} – ${fmtDate(ps[i].to)}</b> dönemleri aynı günleri içeriyor; bu günler iki kez düşülür.`,['Dönemleri kontrol edin; aynı tutukluluğu iki kez eklemediğinizden emin olun.']);return}}
  credit+=periodDays;const hasCredit=credit>0;
  const rec=document.getElementById('recidivist').checked,prev=dur3(dval('prevYear'),dval('prevMonth'),dval('prevDay'));
  if(rec&&U(prev)<=0){showUnsupported('İlk tekerrür / 5275 m.108','İlk tekerrürde m.108/2 uyarınca koşullu salıverme süresine eklenecek miktar, tekerrüre esas alınan cezanın en ağırından fazla olamaz. Bu nedenle tekerrüre esas önceki cezanın miktarı girilmeden kesin tarih üretilmez.');return}
  if(life&&agg&&K.noAggKs){showUnsupported('Ağırlaştırılmış müebbet / 5275 m.107/16, 3713 m.17','Terör suçlarından veya örgüt faaliyeti çerçevesinde işlenen devletin güvenliğine, anayasal düzene ve millî savunmaya karşı suçlardan ağırlaştırılmış müebbet hapis cezasına mahkûmiyette koşullu salıverilme hükümleri uygulanmaz; ceza hayat boyu çekilir.');return}



  if(child&&(!c7593Applies(K,crimeDate)||crimeDate<=new Date('2020-03-30T23:59:59'))&&(!birth||!start)){
    showUnsupported('7593 sayılı Kanun / yaş verisi gerekli','Çocuk hükümlü senaryosunda 5275 m.107/5 kontrolü için doğum tarihi ile infaza başlama/cezaevine giriş tarihi birlikte gereklidir. Bu veriler olmadan 15 yaş öncesi kurum süresi güvenilir biçimde değerlendirilemez.');return;
  }
  let ratio=baseRatio(crime,child),reasons=['Süreler müddetname uygulamasındaki gibi güne çevrilerek hesaplandı (yıl 365, ay 30 gün); gün küsuratı TCK m.61/6 uyarınca hesaba katılmadı; tarihler infaza başlama tarihine gün eklenerek bulundu.'];
  if(pre6545TwoThirds(crime,crimeDate)){ratio=2/3;reasons.push('28.06.2014 öncesi suç bakımından 6545 sayılı Kanunla getirilen özel 108/9 rejimi henüz yürürlükte olmadığından, o tarihte geçerli genel 2/3 koşullu salıverilme oranı esas alındı.');}
  else reasons.push('Temel koşullu salıverilme oranı '+ratioLabel(ratio)+' olarak değerlendirildi.');
  if(secondRec){ratio=Math.max(ratio,3/4);reasons.push('4.6.2025 değişikliği sonrası ikinci defa tekerrürde süreli hapis için 3/4 oranı dikkate alındı; m.108/2 sınırı ikinci tekerrürde uygulanmaz.')}
  let ksGross,recAdd=0,lifeYears=0;
  if(life){
    const againstChild=document.getElementById('againstChild')?.checked;
    const pre6545=crimeDate<new Date('2014-06-28T00:00:00');let baseY=K.m&&!(K.p6545&&pre6545)?K.m[agg?1:0]:(agg?30:24);const recY=agg?39:33;if(againstChild&&!pre6545)baseY=Math.max(baseY,recY);
    if(pre6545&&(K.p6545||againstChild))reasons.push('Suç 28.06.2014 öncesinde işlendiği için 6545 sayılı Kanunla getirilen 108/8 ve 108/9 süreleri (33/39 yıl) uygulanmadı; koşullu salıverilmeye ilişkin aleyhe hükümler geçmişe uygulanmaz (TCK m.7/3).');
    lifeYears=secondRec?Math.max(baseY,recY):baseY;ksGross=lifeYears*365;
    if(rec&&recY>baseY){recAdd=Math.min((recY-baseY)*365,prev);ksGross+=recAdd}
    reasons.push((agg?'Ağırlaştırılmış müebbet':'Müebbet')+' hapiste koşullu salıverilme için kurumda geçirilmesi gereken süre '+lifeYears+' yıl olarak alındı (5275 m.107/2, 107/4, 108; 3713 m.17).'+(recAdd?' İlk tekerrür nedeniyle '+fdurFull(recAdd)+' eklendi (m.108/2 sınırı).':''));
  }else{
    ksGross=frac(total,ratio);
    if(rec&&!secondRec){const r2=frac(total,Math.max(2/3,ratio));recAdd=Math.min(dsub(r2,ksGross),prev);ksGross+=recAdd;reasons.push('İlk tekerrür: 5275 m.108/1-d uyarınca 2/3 oranı esas alındı; m.108/2 uyarınca eklenen süre ('+fdurFull(recAdd)+') tekerrüre esas cezanın en ağırını aşamaz.')}
  }
  const firstKs=ksGross;let dates=[crimeDate],multiLi='';
  if(multi){
    const birthD=birth,items=[];let sumShare=0,sumTotal=total,anyOrg=!!(K.m&&K.open==='none'&&!child);
    const opens=[K.open],flags={ex5:!!K.ex5,neg:!!K.neg,t6:!!K.t6,g10x:!!K.g10x,g62x:!!K.g62x,sex:!!K.sex,negKill:!!K.negKill,c75:c7593Applies(K,crimeDate),p108:!!(K.p6545&&!child&&crimeDate>=new Date('2014-06-28T00:00:00'))};
    for(const [n,x] of extras.entries()){
      const kx=crimeInfo(x.crime),cx=birthD&&x.date?ageOn(birthD,x.date)<18:child;
      let rx=baseRatio(x.crime,cx);if(x.date&&x.date<new Date('2014-06-28T00:00:00')&&kx.p6545)rx=2/3;if(secondRec)rx=Math.max(rx,3/4);
      const share=frac(x.total,rx);sumShare+=share;sumTotal+=x.total;dates.push(x.date);opens.push(kx.open);
      flags.ex5=flags.ex5||!!kx.ex5;flags.neg=flags.neg&&!!kx.neg;flags.t6=flags.t6||!!kx.t6;flags.g10x=flags.g10x||!!kx.g10x;flags.g62x=flags.g62x||!!kx.g62x;flags.sex=flags.sex||!!kx.sex;flags.negKill=flags.negKill||!!kx.negKill;flags.c75=flags.c75||c7593Applies(kx,x.date);flags.p108=flags.p108||!!(kx.p6545&&!cx&&x.date>=new Date('2014-06-28T00:00:00'));
      if(kx.open==='none'&&!cx)anyOrg=true;
      items.push(`<li>${n+2}. ceza: ${x.label}, <b>${fdur(x.total)}</b> → koşullu salıverilme payı (${ratioWords(rx)}): <b>${fdur(share)}</b></li>`);
    }
    const strict=opens.includes('none')?'none':opens.includes('t3')?'t3':opens.includes('f5')?'f5':'g7';
    K={...K,open:strict,...flags};
    let cap,capTxt;
    if(life){cap=(agg?(anyOrg?40:36):(anyOrg?34:30))*365;capTxt=(agg?(anyOrg?'40':'36'):(anyOrg?'34':'30'))+' yıl (5275 m.107/'+(anyOrg?'4':'3')+')'}
    else{const c32=anyOrg||rec||secondRec||flags.p108;cap=(c32?32:28)*365;capTxt=(c32?'32':'28')+' yıl (5275 m.'+(anyOrg?'107/4-e':c32?'108/1-c':'107/3-e')+')'}
    if(life&&firstKs>cap){cap=firstKs;capTxt=fdur(firstKs)+' (tek başına müebbet için aranan süre; içtima bu sürenin altına indiremez, 5275 m.108)'}
    const raw=ksGross+sumShare;ksGross=Math.min(raw,cap);if(!life)total=sumTotal;
    multiLi=items.join('')+`<li>Cezalar toplanır (içtima, 5275 m.99): koşullu salıverilme için toplam süre <b>${fdur(ksGross)}</b>${raw>cap?` (kanuni üst sınır ${capTxt} uygulandı)`:''}${life?'':`; toplam ceza <b>${fdur(total)}</b>`}${hasCredit?` (düşülen süre çıkarılınca <b>${fdur(dsub(ksGross,credit))}</b>)`:''}.</li>`;
    reasons.push('İçtima: her cezanın koşullu salıverilme payı kendi oranıyla hesaplanıp toplandı; üst sınır '+capTxt+'. Açık kuruma ayrılmada en ağır şart esas alındı (Yönetmelik m.6/3). Geçiş hükümleri yalnızca bütün suç tarihleri ilgili döneme giriyorsa uygulandı.');
  }
  if(!multi)K={...K,c75:c7593Applies(K,crimeDate)};
  const allDates=dates.filter(Boolean),legacyAll=allDates.length&&allDates.every(d=>needsLegacyDsReview(d)),pre2020All=allDates.length&&allDates.every(d=>d<=new Date('2020-03-30T23:59:59')),tenAny=allDates.some(d=>tenPercentRuleApplies(d));
  if(multi&&!legacyAll&&allDates.some(d=>needsLegacyDsReview(d)))reasons.push('Suç tarihleri farklı dönemlere düştüğü için 31.7.2023 öncesine ilişkin geçiş hükümleri uygulanmadı; somut dosyada ayrıca değerlendirilmelidir.');
  let ksNet=dsub(ksGross,credit);const fullNet=life?null:dsub(total,credit);
  // Çocuklarda yaş indirimli sayım: Geçici 6/4 (30.3.2020 ve öncesi: 15 yaşa kadar 1 gün = 3, 18 yaşa kadar 1 gün = 2), 107/5 (istisnalar dışında 15 yaşa kadar 1 gün = 2)
  let accelLi='';
  const accelRule=child&&birth&&start?(pre2020All?'g64':(!K.c75?'p1075':null)):null;
  if(child&&!pre2020All&&!K.c75&&(K.c7593||extras.some(x=>crimeInfo(x.crime).c7593)))reasons.push('7593 sayılı Kanunla 107/5’e eklenen suç istisnaları (81-83, 102, 103, 188, 220) 18.08.2026 ve sonrasında işlenen suçlara uygulanır; daha önceki suçlarda yaş indirimli sayım istisnasız uygulanır (TCK m.7/3).');
  if(accelRule){
    let counted=Math.min(credit,ksGross),d=0;const day=new Date(start);
    while(counted<ksGross&&d<40000){const a=ageOn(birth,day);counted+=accelRule==='g64'?(a<15?3:a<18?2:1):(a<15?2:1);d++;day.setDate(day.getDate()+1)}
    if(d<ksNet){const saved=ksNet-d;ksNet=d;
      accelLi=`<li>Çocuk yaşta cezaevinde geçen günler fazla sayılır (${accelRule==='g64'?'15 yaşına kadar 1 gün 3 gün, 18 yaşına kadar 1 gün 2 gün; 5275 Geçici m.6/4':'15 yaşına kadar 1 gün 2 gün; 5275 m.107/5'}). Bu nedenle koşullu salıverilme yaklaşık <b>${fdur(saved)}</b> erken gelir.</li>`;
      reasons.push((accelRule==='g64'?'Geçici 6/4':'107/5')+' uyarınca yaş indirimli sayım gün gün uygulandı; koşullu salıverilme '+saved+' gün öne geldi. Mahsup edilen süreler ihtiyatlı olarak bire bir sayıldı; denetimli serbestlik ve açık kurum eşikleri yaklaşık olarak bu tarihe göre belirlendi.');}
  }
  const ksLine=life?`<li>${agg?'Ağırlaştırılmış müebbet':'Müebbet'} hapiste koşullu salıverilme için cezaevinde geçirilmesi gereken süre: <b>${lifeYears} yıl</b>${hasCredit?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`:null;
  const recLi=recAdd?`<li>Mükerrir olduğu için bu süreye <b>${fdur(recAdd)}</b> eklendi; eklenen süre önceki cezanın en ağırını aşamaz. Toplam: <b>${fdur(firstKs)}</b>${hasCredit&&!multi?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`:'';
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
  const womanChild=document.getElementById('womanChild')?.checked,illness=document.getElementById('illness')?.checked;
  const legacy=legacyAll,pre2020=pre2020All;
  const age70=document.getElementById('age70')?.checked,ageNow=ageOn(birth,start||new Date());
  const g6=legacy&&pre2020&&!K.t6,g62=legacy&&pre2020&&!K.g62x;
  const ill65=g62&&illness&&ageNow!==null&&ageNow>=65;
  let dsWindow=Math.max(g6?1095:365,womanChild?(g62?1460:730):0,age70&&g62?1460:0,illness?1095:0);
  if(ill65)dsWindow=Math.max(dsWindow,ksNet);
  const g6Closed=legacy&&pre2020&&(g6||(g62&&(womanChild||age70||ill65)));
  // Geçici 6/3: 30.3.2020 öncesi, 6/1 istisnası olmayan örgüt suçlarında açık kuruma ayrılamasa da DS kapalı kurumdan uygulanabilir.
  const dsFromClosed=noOpen&&!(life&&agg)&&g6Closed,noDs=noOpen&&!dsFromClosed;
  if(dsFromClosed){const i=reasons.findIndex(r=>r.includes('m.8/1-ç'));const t='Örgüt suçlarından hükümlüler Yönetmelik m.8/1-ç uyarınca açık kuruma ayrılamaz; ancak suç 30.03.2020 ve öncesinde işlendiği ve Geçici 6/1 istisnaları arasında olmadığı için Geçici 6/3 uyarınca denetimli serbestlik kapalı kurumdan da uygulanabilir.';if(i>=0)reasons[i]=t;else reasons.push(t)}
  if(g62&&(womanChild||age70))reasons.push('Geçici 6/2-a: 30.03.2020 ve öncesi suçlarda 0-6 yaş çocuklu kadın ve 70 yaşını bitirmiş hükümlülerde 105/A-3’teki iki yıllık süre dört yıl olarak uygulandı.');
  if(ill65)reasons.push('Geçici 6/2-b: ağır hastalık, engellilik veya kocama nedeniyle hayatını yalnız idame ettiremeyen 65 yaşını bitirmiş hükümlüde koşullu salıverilmeye kadar sürenin tamamı denetimli serbestlikle geçirilebilir.');
  if(g6Closed)reasons.push('Geçici 6/3: bu süreler iyi hâlli olmak koşuluyla kapalı ceza infaz kurumunda bulunan hükümlülere de uygulanır; denetimli serbestlik için açık kuruma ayrılma şartı aranmadı.');
  if(age70&&!g62)reasons.push('70 yaş için özel denetimli serbestlik süresi yalnızca 30.03.2020 ve öncesi suçlarda (Geçici 6/2-a) öngörülmüştür; bu dosyada genel süre uygulandı.');
  if(g6)reasons.push('30.03.2020 ve öncesinde işlenen, Geçici 6/1 istisnaları dışındaki suçlarda 105/A’daki bir yıllık süre üç yıl olarak uygulandı'+(womanChild?'; 0-6 yaş çocuklu kadın hükümlüde Geçici 6/2-a uyarınca dört yıl':'')+'.');
  if(womanChild&&!g62)reasons.push('5275 m.105/A-3-a uyarınca 0-6 yaş grubunda çocuğu bulunan kadın hükümlüde denetimli serbestlik süresi 2 yıl olarak uygulandı.');
  if(illness&&!ill65)reasons.push('5275 m.105/A-3-b uyarınca ağır hastalık, engellilik veya kocama nedeniyle hayatını yalnız idame ettiremeyen hükümlüde denetimli serbestlik süresi 3 yıl olarak uygulandı.');
  const prisonBase=dsub(ksNet,dsWindow);
  let prison=prisonBase,prisonEarly=null,tenLi='';
  if(tenAny){
    const minInstitution=dmax(frac(ksGross,1/10),5);
    prison=dmax(prisonBase,minInstitution);
    reasons.push('4.6.2025 sonrası suçlarda 105/A için en az 5 gün ve koşullu salıverilmeye kadar kurumda geçirilmesi gereken sürenin en az 1/10’u kontrolü uygulandı.');
    if(U(prison)>U(prisonBase))tenLi=`<li>4 Haziran 2025 ve sonrasında işlenen suçlarda, denetimli serbestliğe çıkabilmek için koşullu salıverilmeye kadarki sürenin en az onda biri (en az 5 gün) cezaevinde geçirilmelidir: <b>${fdur(minInstitution)}</b></li>`;
    if(hasCredit){
      const early=dmax(prisonBase,dsub(minInstitution,credit));
      if(U(early)<U(prison)){prisonEarly=early;reasons.push('Mahsup edilen sürenin ne kadarının ceza infaz kurumunda (tutuklulukta) geçtiği formdan anlaşılamadığından 1/10 kurum süresi şartı ihtiyatlı biçimde yalnızca infaza başlamadan sonraki süreye uygulandı. Mahsup süresinin tamamı kurumda geçmişse DS eşiği '+(U(early)===0?'infaza başlama tarihine':'infaza başlamadan '+fdurFull(early)+' sonrasına')+' kadar öne gelebilir.');}
    }
  }
  if(!g6Closed&&openAt!==null&&U(openAt)>U(prison)){prison=openAt;prisonEarly=null;reasons.push('105/A için açık kurumda bulunma şartı nedeniyle DS eşiği açık kuruma ayrılma tarihinden önce olamaz.')}
  if(U(prison)>U(ksNet)){prison=ksNet;prisonEarly=null}
  if(noDs){prison=ksNet;prisonEarly=null}
  let g10Li='',g10On=false;
  if(legacy&&!juv&&!noDs&&openAt!==null){
    if(K.g10x){g10Li='<li>Suç 31 Temmuz 2023 veya öncesinde işlenmiş olsa da bu suç türü Geçici 10/6 kapsamı dışında kaldığı için açık cezaevine ve denetimli serbestliğe 3 yıl erken geçiş uygulanmaz.</li>';reasons.push('Geçici 10/6 istisna suçlarından olduğu için 3 yıl erken açık/DS uygulanmadı.')}
    else{
      const cmin=(life||total>=3650)?90:30,nOpen=openAt,nDs=prison;
      const gOpen=directOpen?0:Math.min(nOpen,Math.max(cmin,nOpen-1095));
      const gDs=Math.min(nDs,Math.max(nDs-1095,gOpen+90));
      openAt=gOpen;prison=gDs;prisonEarly=null;g10On=true;
      g10Li=`<li>Suç 31 Temmuz 2023 veya öncesinde işlendiği için açık cezaevine ve denetimli serbestliğe <b>3 yıl erken</b> geçilebilir (5275 Geçici m.10/6). Bunun için en az ${cmin===90?'3 ay':'1 ay'} kapalı cezaevinde ve en az 3 ay açık cezaevinde kalınmış olmalıdır.</li>`;
      reasons.push('Geçici 10/6 (7571 sayılı Kanunla değişik): 31.7.2023 ve öncesi suçlarda, toplam ceza 10 yıldan azsa 1 ay, fazlaysa 3 ay kapalıda kalıp açığa ayrılmasına 3 yıl veya daha az kalanlar açığa ayrılabilir; en az 3 ay açıkta kalmak şartıyla DS’den 3 yıl erken yararlanılır.');
    }
  }else if(legacy&&juv)reasons.push('31.7.2023 ve öncesi suçlarda çocuk eğitimevindeki hükümlüler bakımından Geçici 10/6 ayrıca değerlendirilmelidir; hesap genel kurallara göre yapıldı.');
  if(openAt!==null&&openAt>prison)openAt=prison;
  const dsActual=dsub(ksNet,prison);
  const closedPart=openAt!==null?openAt:prison,openPart=openAt!==null?dsub(prison,openAt):ZERO;
  let dateCards='',timeline='';
  if(start){
    dateCards=`${openAt!==null&&U(openAt)>0?`<div class="stat highlight"><span>AÇIK KURUMA AYRILMA (TAHMİNİ)</span><b>${when(openAt)}</b></div>`:''}${noDs?'':`<div class="stat highlight"><span>DENETİMLİ SERBESTLİK İÇİN ARİTMETİK EŞİK</span><b>${when(prison)}</b></div>`}<div class="stat highlight"><span>KOŞULLU SALIVERİLME ARİTMETİK TARİHİ</span><b>${when(ksNet)}</b></div>`;
    timeline=`<h3 class="result-title">Aritmetik zaman çizelgesi</h3><div class="timeline"><div class="timeline-row"><span>İNFAZA BAŞLAMA</span><strong>${fmtDate(start)}</strong></div>${openAt!==null&&U(openAt)>0?`<div class="timeline-row"><span>AÇIK KURUMA AYRILMA</span><strong>${when(openAt)}</strong></div>`:''}${noDs?'':`<div class="timeline-row"><span>DS ARİTMETİK EŞİĞİ</span><strong>${when(prison)}</strong></div>`}<div class="timeline-row"><span>KS ARİTMETİK TARİHİ</span><strong>${when(ksNet)}</strong></div><div class="timeline-row"><span>${life?'DENETİM SÜRESİ SONU':'BİHAKKIN ARİTMETİK TARİH'}</span><strong>${when(life?dadd(ksNet,ksGross):fullNet)}</strong></div></div>`;
  }
  const b18=birth?new Date(birth.getFullYear()+18,birth.getMonth(),birth.getDate(),12):null;
  const juvOpen=juv&&start&&b18&&b18>start&&b18<at(start,prison);
  const steps=[];
  if(start){
    if(noDs){
      steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(ksNet)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdur(ksNet)}</b> kapalı cezaevinde kalınır. ${agg?'Ağırlaştırılmış müebbet hapis cezasında':'Terör ve örgüt suçlarında kural olarak'} açık cezaevine geçilemez; bu yüzden denetimli serbestlik de uygulanmaz.</p></li>`);
    }else if(juv){
      if(juvOpen){
        steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${fmtDate(b18)}</span><strong>Çocuk eğitimevi</strong><p>18 yaşını bitirene kadar yaklaşık <b>${fdurAbout(between(start,b18))}</b> çocuk eğitimevinde kalınır.</p></li>`);
        steps.push(`<li><span class="ps-when">${fmtDate(b18)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>18 yaşını bitirince suç türüne bakılmaksızın açık cezaevine gönderilir; eğitime devam ediyorsa bu 21 yaşını bitirince olur. Yaklaşık <b>${fdurAbout(between(b18,at(start,prison)))}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
      }else if(U(prison)>0)steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(prison)}</span><strong>Çocuk eğitimevi</strong><p>Yaklaşık <b>${fdur(prison)}</b> çocuk eğitimevinde kalınır.</p></li>`);
    }else{
      if(!directOpen&&U(closedPart)>0)steps.push(`<li><span class="ps-when">${fmtDate(start)} → ${when(closedPart)}</span><strong>Kapalı cezaevi</strong><p>Yaklaşık <b>${fdurAbout(closedPart)}</b> kapalı cezaevinde kalınır. ${openAt===null?'Suç 30 Mart 2020 veya öncesinde işlendiği için denetimli serbestliğe kapalı cezaevinden de geçilebilir (5275 Geçici m.6/3); bunun için iyi hâlli olmak gerekir.':'Açık cezaevine geçmek için iyi hâlli olmak ve cezaevi idaresinin kararı gerekir.'}</p></li>`);
      if(U(openPart)>0||directOpen)steps.push(`<li><span class="ps-when">${when(openAt)} → ${when(prison)}</span><strong>Açık cezaevi</strong><p>${directOpen?(total>1095?'Taksirli suçta toplam ceza 5 yıl':'Toplam ceza 3 yıl')+' veya daha az olduğu için doğrudan açık cezaevine alınır. ':''}Yaklaşık <b>${fdurAbout(openPart)}</b> açık cezaevinde kalınır. Açık cezaevinde dış güvenlik görevlisi yoktur ve hükümlülerin çalıştırılmasına öncelik verilir.</p></li>`);
    }
    if(!noDs)steps.push(`<li><span class="ps-when">${when(prison)} → ${when(ksNet)}</span><strong>Denetimli serbestlik</strong><p>Yaklaşık <b>${fdur(dsActual)}</b> dışarıda, imza ve kurallara uyarak geçirilir. Kurallara uyulmazsa cezaevine geri dönülebilir.</p></li>`);
    steps.push(`<li><span class="ps-when">${when(ksNet)}</span><strong>Koşullu salıverilme</strong><p>${life?`Cezaevinden çıkılır. Ardından <b>${fdur(ksGross)}</b> denetim süresi başlar (5275 m.107/6); bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.`:'Cezaevi ile ilişki sona erer. Ancak cezanın asıl bitiş tarihine kadar “denetim süresi” devam eder; bu sürede kasıtlı yeni bir suç işlenirse salıverilme geri alınabilir.'}</p></li>`);
    steps.push(life?`<li><span class="ps-when">${when(dadd(ksNet,ksGross))}</span><strong>Denetim süresinin bitmesi</strong><p>Denetim süresi kurallara uyularak geçirilirse ceza infaz edilmiş sayılır (5275 m.107/14).</p></li>`:`<li><span class="ps-when">${when(fullNet)}</span><strong>Cezanın tamamen bitmesi</strong><p>Mahkemenin verdiği cezanın tamamı dolar.</p></li>`);
  }
  let head;
  if(noDs){
    head=`<p class="plain-big">${start?`Koşullu salıverilme için tahmini tarih: <b>${when(ksNet)}</b>`:`Koşullu salıverilmeye kadar cezaevinde kalınacak tahmini süre: <b>${fdur(ksNet)}</b>`}</p><p class="plain-sub">${noOpenTxt}</p>`;
  }else{
    head=`${start?(U(prison)>0?`<p class="plain-big">En erken <b>${when(prison)}</b> tarihinde denetimli serbestlikle cezaevinden çıkış mümkün olabilir.</p>`:`<p class="plain-big">Hesaba göre cezaevinde kalınacak süre çok kısa; denetimli serbestlik değerlendirmesi hemen gündeme gelebilir.</p>`):`<p class="plain-big">Cezaevinde kalınacak tahmini süre: <b>${fdur(prison)}</b></p>`}${!juv&&openAt!==null&&U(prison)>0?`<p class="plain-sub">Bu sürenin ${directOpen?'tamamı açık cezaevinde geçer.':U(openPart)>0?`yaklaşık <b>${fdurAbout(closedPart)}</b> kısmı kapalı, <b>${fdurAbout(openPart)}</b> kısmı açık cezaevinde geçer.`:'tamamı kapalı cezaevinde geçer.'}</p>`:''}${juvOpen?`<p class="plain-sub">Bu sürenin yaklaşık <b>${fdurAbout(between(start,b18))}</b> kısmı çocuk eğitimevinde, <b>${fdurAbout(between(b18,at(start,prison)))}</b> kısmı açık cezaevinde geçer.</p>`:''}<p class="plain-sub">${start&&U(prison)>0?'Bu tarihten':'Bu süreden'} sonra cezanın kalanı dışarıda, imza ve kurallara uyma gibi yükümlülüklerle geçirilir. Bunun için cezaevinde iyi hâlli olmak ve infaz hâkiminin onayı gerekir.</p>${prisonEarly!==null?`<p class="plain-sub">Tutuklulukta cezaevinde geçen süre de hesaba katılırsa ${U(prisonEarly)===0?'denetimli serbestlik hemen gündeme gelebilir.':start?`çıkış tarihi öne gelebilir (en erken: <b>${when(prisonEarly)}</b>).`:`cezaevinde kalınacak süre kısalabilir (en kısa: <b>${fdur(prisonEarly)}</b>).`}</p>`:''}`;
  }
  const female=document.getElementById('female')?.checked||womanChild;
  let homeLi='';
  if(!life&&total>0&&(K.sex||K.open==='none'))homeLi='<li>Terör, örgüt ve cinsel dokunulmazlığa karşı suçlarda cezanın konutta, hafta sonları veya geceleri çektirilmesi mümkün değildir (5275 m.110/9).</li>';
  else if(!life&&total>0){
    const homeLim=(ageNow>=80?2190:ageNow>=75?1825:ageNow>=70?1460:(female||child||ageNow>=65)?1095:0);
    if(homeLim&&total<=homeLim)homeLi+=`<li>Toplam ceza ${fdur(homeLim)} veya daha az olduğu için, suçtan doğan zarar giderilmişse cezanın <b>konutta çektirilmesi</b> infaz hâkiminden istenebilir (5275 m.110/2).</li>`;
    const allNeg=K.neg;
    if(!K.negKill&&total<=(allNeg?1825:1095))homeLi+=`<li>Toplam ceza ${allNeg?'5 yıl (taksirle öldürme hariç)':'3 yıl'} veya daha az olduğu için cezanın <b>hafta sonları veya geceleri</b> cezaevinde çektirilmesi infaz hâkiminden istenebilir (5275 m.110/1).</li>`;
  }
  let todayTxt='';
  if(start){const today=new Date();today.setHours(12,0,0,0);const dsD=at(start,prison),ksD=at(start,ksNet);
    if(!noDs&&today<dsD)todayTxt=`Bugün (${fmtDate(today)}) itibarıyla denetimli serbestliğe <b>${fdurAbout(between(today,dsD))}</b>, koşullu salıverilmeye <b>${fdurAbout(between(today,ksD))}</b> kaldı.`;
    else if(today<ksD)todayTxt=`Bugün (${fmtDate(today)}) itibarıyla koşullu salıverilmeye <b>${fdurAbout(between(today,ksD))}</b> kaldı.`;
    else todayTxt=`Hesaplanan koşullu salıverilme tarihi geçmiş görünüyor (${fmtDate(ksD)}).`;}
  const html=`<div class="plain"><div class="plain-head"><span class="plain-kicker">KISACA SONUÇ</span>${head}${todayTxt?`<p class="plain-sub plain-today">${todayTxt}</p>`:''}${start?'':'<p class="plain-sub"><b>Tarihleri görmek için yukarıya cezaevine giriş tarihini yazın.</b></p>'}</div>${steps.length?`<ol class="plain-steps">${steps.join('')}</ol>`:''}<div class="plain-why"><h4>Bu sonuç nasıl çıktı?</h4><ul><li>${multi?'1. ceza':'Mahkemenin verdiği ceza'}: <b>${totalLabel}</b></li>${hasCredit?`<li>Gözaltı ve tutuklulukta geçen, cezadan düşülen süre: <b>${fdur(credit)}</b>${periodDays?` (tarihle girilen dönemler: ${periodDays} gün, giriş ve çıkış günleri dahil)`:''}</li>`:''}${ksLine||`<li>Bu suç türünde koşullu salıverilme için cezanın <b>${ratioWords(ratio)}</b> çekmek gerekir: <b>${fdur(firstKs-recAdd)}</b>${hasCredit&&!recAdd&&!multi?` (düşülen süre çıkarılınca <b>${fdur(ksNet)}</b>)`:''}</li>`}${recLi}${multiLi}${accelLi}${openLi}${g10Li}${noDs?'':`<li>Bu sürenin koşullu salıverilmeden önceki son kısmı (${ill65?'Geçici 6/2-b uyarınca tamamı':`en fazla ${fdur(g10On?dsWindow+1095:dsWindow)}${g10On?', Geçici 10/6 ile eklenen 3 yıl dahil':''}`}) denetimli serbestlikle dışarıda geçirilebilir: <b>${fdur(dsActual)}</b></li>${tenLi}<li>${tenLi?'Bu nedenle cezaevinde geçirilecek süre':'Geriye kalan kısım cezaevinde geçirilir'}: <b>${fdur(prison)}</b></li>`}${noOpen?`<li>${agg?'Ağırlaştırılmış müebbet hapis cezasına mahkûm olanlar':'Terör ve örgüt suçlarından hükümlüler'} kural olarak açık cezaevine geçemez; ${dsFromClosed?'ancak suç 30.03.2020 ve öncesinde işlendiği için denetimli serbestlik kapalı cezaevinden de uygulanabilir (5275 Geçici m.6/3).':'denetimli serbestlik için açık cezaevinde bulunmak gerekir.'}</li>`:''}${childLi}${homeLi}</ul></div>${creditNote(manualCredit,start)}${plainWarn()}<button type="button" class="btn secondary print-btn" id="printBtn">Sonucu yazdır / PDF olarak kaydet</button>${techBlock(`<div class="summary"><div class="eyebrow inline-style-2">İNFAZ SONUÇ PARAMETRELERİ</div><div class="rate">${life?lifeYears+' yıl koşullu salıverilme süresi':ratioLabel(ratio)+' koşullu salıverilme oranı'}</div><p>${crimeText}</p></div><h3 class="result-title">Süre parametreleri</h3><div class="stats"><div class="stat"><span>TOPLAM CEZA</span><b>${life?totalLabel:fdurFull(total)}</b></div><div class="stat"><span>MAHSUP</span><b>${fdurFull(credit)}</b></div><div class="stat"><span>KOŞULLU SÜRE</span><b>${fdurFull(ksGross)}</b></div><div class="stat"><span>MAHSUP SONRASI</span><b>${fdurFull(ksNet)}</b></div><div class="stat"><span>TAHMİNİ KURUM SÜRESİ</span><b>${fdurFull(prison)}</b></div>${!juv&&openAt!==null?`<div class="stat"><span>KAPALI KURUM (TAHMİNİ)</span><b>${fdurFull(closedPart)}</b></div><div class="stat"><span>AÇIK KURUM (TAHMİNİ)</span><b>${fdurFull(openPart)}</b></div>`:''}<div class="stat"><span>TAHMİNİ DS SÜRESİ</span><b>${fdurFull(dsActual)}</b></div>${dateCards}</div>${timeline}<div class="reason"><b>Hesaplama açıklaması</b><br>${reasons.join('<br>')}<br>105/A uygulaması ayrıca açık kurum/çocuk eğitimevi statüsü, iyi hâl ve infaz hâkimi değerlendirmesine bağlıdır. Açık kuruma ayrılma idare ve gözlem kurulu kararına bağlıdır; yüksek güvenlikli kurum, disiplin cezası ve firar gibi hâller otomatik değerlendirilmez. Sonuç resmi müddetname değildir.</div>`)}</div>`;
  const result=document.getElementById('result');result.innerHTML=html;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function resetForm(){document.querySelectorAll('input').forEach(i=>{if(i.type==='checkbox')i.checked=false;else i.value=''});document.getElementById('crimeType').value='';const st=document.getElementById('sentenceType');if(st)st.value='sureli';const xb=document.getElementById('extraSentences');if(xb)xb.innerHTML='';const pb=document.getElementById('periods');if(pb)pb.innerHTML='';if(typeof syncSentenceType==='function'){syncSentenceType();syncRecidivist()}if(typeof syncLifeExtras==='function')syncLifeExtras();const r=document.getElementById('result');r.classList.remove('show');r.innerHTML=''}
document.getElementById('secondRecidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('recidivist').checked=false});
document.getElementById('recidivist').addEventListener('change',e=>{if(e.target.checked)document.getElementById('secondRecidivist').checked=false});
function syncSentenceType(){const life=(document.getElementById('sentenceType')?.value||'sureli')!=='sureli';const w=document.getElementById('sentenceWrap');if(w)w.hidden=life}
function syncRecidivist(){const w=document.getElementById('prevWrap');if(w)w.hidden=!document.getElementById('recidivist').checked}
document.getElementById('sentenceType')?.addEventListener('change',syncSentenceType);
document.getElementById('recidivist').addEventListener('change',syncRecidivist);
document.getElementById('secondRecidivist').addEventListener('change',syncRecidivist);
syncSentenceType();syncRecidivist();
function readExtraSentences(){return[...document.querySelectorAll('#extraSentences .extra-row')].map(r=>{const sel=r.querySelector('.x-crime'),v=k=>Math.max(0,Number(r.querySelector(k).value)||0);return{crime:sel.value,label:sel.options[sel.selectedIndex]?.text||'',date:parseDate(r.querySelector('.x-date').value),total:dur3(v('.x-y'),v('.x-m'),v('.x-d'))}}).filter(x=>x.crime&&x.total>0)}
function addExtraSentence(){const box=document.getElementById('extraSentences');if(!box)return;const n=box.children.length+2;const row=document.createElement('div');row.className='extra-row';
const h=document.createElement('div');h.className='extra-head';const t=document.createElement('strong');t.textContent=n+'. ceza';const rm=document.createElement('button');rm.type='button';rm.className='extra-remove';rm.textContent='Kaldır';rm.addEventListener('click',()=>{row.remove();[...box.children].forEach((c,i)=>{c.querySelector('.extra-head strong').textContent=(i+2)+'. ceza'})});h.append(t,rm);
const l1=document.createElement('label');l1.textContent='Suç türü';const sel=document.getElementById('crimeType').cloneNode(true);sel.removeAttribute('id');sel.className='x-crime';sel.value='';l1.append(sel);
const l2=document.createElement('label');l2.textContent='Suç tarihi';const d=document.createElement('input');d.type='date';d.className='x-date';l2.append(d);
const l3=document.createElement('label');l3.textContent='Ceza miktarı';const tr=document.createElement('div');tr.className='triple';for(const [c,ph] of [['x-y','Yıl'],['x-m','Ay'],['x-d','Gün']]){const i=document.createElement('input');i.type='number';i.min='0';i.placeholder=ph;i.className=c;tr.append(i)}
row.append(h,l1,l2,l3,tr);box.append(row)}
document.getElementById('addSentenceBtn')?.addEventListener('click',addExtraSentence);
function readPeriods(){return[...document.querySelectorAll('.period-row')].map(r=>({from:parseDate(r.querySelector('.p-from').value),to:parseDate(r.querySelector('.p-to').value)})).filter(x=>x.from&&x.to)}
function addPeriod(){const box=document.getElementById('periods');if(!box)return;const row=document.createElement('div');row.className='period-row extra-row';
const h=document.createElement('div');h.className='extra-head';const t=document.createElement('strong');t.textContent='Gözaltı / tutukluluk dönemi';const rm=document.createElement('button');rm.type='button';rm.className='extra-remove';rm.textContent='Kaldır';rm.addEventListener('click',()=>row.remove());h.append(t,rm);
const g=document.createElement('div');g.className='grid two';for(const [c,lab] of [['p-from','Gözaltı / tutuklama tarihi'],['p-to','Tahliye tarihi']]){const l=document.createElement('label');l.textContent=lab;const i=document.createElement('input');i.type='date';i.className=c;l.append(i);g.append(l)}
row.append(h,g);box.append(row)}
document.getElementById('addPeriodBtn')?.addEventListener('click',addPeriod);
document.addEventListener('click',e=>{if(e.target&&e.target.id==='printBtn')window.print()});
function syncLifeExtras(){const life=(document.getElementById('sentenceType')?.value||'sureli')!=='sureli';const w=document.getElementById('againstChildWrap');if(w)w.hidden=!life}
document.getElementById('sentenceType')?.addEventListener('change',syncLifeExtras);syncLifeExtras();
