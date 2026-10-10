// İnfaz hesaplama regresyon testi: referans dosyalardaki (referans_*.py ile bağımsız hesaplanmış) tarihlerin
// sonuç ekranında birebir göründüğünü doğrular. Kullanım: REF=genel.json BASE=http://... node run.js
const {chromium}=require('playwright');const path=require('path');const C=require(path.resolve(process.env.REF));
const BASE=process.env.BASE||'http://127.0.0.1:8000/infaz-hesaplama.html';
(async()=>{const b=await chromium.launch(process.env.CI?{}:{executablePath:'/opt/pw-browsers/chromium'});let fail=0;
for(const [n,{i,e}] of Object.entries(C)){const ctx=await b.newContext({viewport:{width:390,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',x=>errs.push(x.message));p.on('dialog',d=>{errs.push('ALERT '+d.message());d.dismiss()});
await p.goto(BASE+(process.env.CI?'?nocache='+Date.now():''),{waitUntil:'networkidle'});
await p.selectOption('#crimeType',i.c);await p.fill('#crimeDate',i.cd||'2024-03-10');await p.fill('#birthDate',i.bd||'1980-01-01');await p.fill('#startDate',i.sd||'2025-01-15');if(i.child)await p.check('#childOffender');
if(i.st)await p.selectOption('#sentenceType',i.st);
if(i.y)await p.fill('#sentenceYear',String(i.y));if(i.m)await p.fill('#sentenceMonth',String(i.m));
if(i.rec){await p.check('#recidivist');if(i.py)await p.fill('#prevYear',String(i.py));if(i.pm)await p.fill('#prevMonth',String(i.pm));}
for(const x of (i.x||[])){await p.click('#addSentenceBtn');const r=(await p.$$('.extra-row')).pop();await (await r.$('.x-crime')).selectOption(x.c);await (await r.$('.x-date')).fill(x.cd);if(x.y)await (await r.$('.x-y')).fill(String(x.y));if(x.m)await (await r.$('.x-m')).fill(String(x.m));}
if(i.wc)await p.check('#womanChild');if(i.ill)await p.check('#illness');
await p.click('#calculateBtn');await p.waitForTimeout(900);await p.click('.tech summary').catch(()=>{});
const t=await p.$eval('#result',x=>x.innerText);
const exp=Object.values(e).filter(Boolean);if(e.open===null)exp.push('doğrudan açık');if(!('ds' in e))exp.push('açık cezaevine geçilemez');
const miss=exp.filter(x=>!t.includes(x));const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
const ok=!miss.length&&!errs.length&&!ov;if(!ok)fail++;
console.log((ok?'PASS ':'FAIL ')+n+(miss.length?' missing='+JSON.stringify(miss):'')+(errs.length?' errs='+JSON.stringify(errs):'')+(ov?' OVERFLOW':''));
if(!ok)console.log('   >> '+t.slice(0,700).replace(/\n+/g,' | '));
await ctx.close()}
console.log(fail?'FAILURES '+fail:'ALL PASS');await b.close();if(fail)process.exit(1)})();
