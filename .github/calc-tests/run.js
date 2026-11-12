// Hesaplama araçları regresyon testi.
// Kullanım: BASE=http://127.0.0.1:4173/ node .github/calc-tests/run.js
// Geçerli girdilerin sonucu expected.json ile birebir aynı olmalı; geçersiz girdiler sonuç yerine uyarı vermeli.
// Beklenen sonuçları yenilemek için: UPDATE=1 ile çalıştırın.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const cases = require('./cases.js');
const BASE = process.env.BASE || 'http://127.0.0.1:4173/';
const REF = path.join(__dirname, 'expected.json');
const looksLikeResult = t => /-₺|TAHMİNİ|MİRASÇI|YASAL ÜST|YENİ AYLIK|ANA PARA|Devlete/.test(t);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const got = []; const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  for (const [page, fields, btn, rid, kind] of cases) {
    await p.goto(BASE + page + '.html');
    for (const [k, v] of Object.entries(fields)) {
      const tag = await p.$eval('#' + k, e => e.tagName);
      if (tag === 'SELECT') await p.selectOption('#' + k, v); else await p.fill('#' + k, v);
    }
    await p.click(btn); await p.waitForTimeout(150);
    const text = await p.$eval('#' + rid, e => e.innerText.replace(/\s+/g, ' ').trim());
    const live = await p.$eval('#' + rid, e => e.getAttribute('aria-live'));
    got.push({ page, fields, kind, text, live });
  }
  await b.close();
  if (process.env.UPDATE) { fs.writeFileSync(REF, JSON.stringify(got, null, 1) + '\n'); console.log('expected.json güncellendi:', got.length); return; }
  const ref = JSON.parse(fs.readFileSync(REF, 'utf8')); let fail = 0;
  got.forEach((g, i) => {
    const id = `${g.page} ${JSON.stringify(g.fields)}`;
    if (g.live !== 'polite') { fail++; console.log('FAIL aria-live yok:', id); }
    if (g.kind === 'ok' && (!ref[i] || ref[i].text !== g.text)) { fail++; console.log('FAIL sonuç değişti:', id, '\n  beklenen:', ref[i] && ref[i].text, '\n  gelen:   ', g.text); }
    if (g.kind === 'bad' && looksLikeResult(g.text)) { fail++; console.log('FAIL geçersiz girdi sonuç üretti:', id, '\n  ', g.text); }
  });
  if (errs.length) { fail++; console.log('FAIL JS hatası:', errs); }
  console.log(fail ? `${fail} FAIL / ${got.length}` : `ALL PASS (${got.length})`);
  process.exit(fail ? 1 : 0);
})();
