// Tutar kutularında binlik ayıracı (tutar-bicim.js): gerçek klavye yazımı, yapıştırma ve silme.
// 1) Kutuda görünen metin ve hesaplamanın okuduğu değer doğru mu?
// 2) Aynı tutar klavyeyle biçimli yazıldığında hesap sonucu, değerin doğrudan atandığı hesapla birebir aynı mı?
// Kullanım: BASE=http://127.0.0.1:8000/ node .github/calc-tests/bicim.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8000/';
let ok = 0, bad = 0;
const check = (ad, pass, info) => { if (pass) ok++; else { bad++; console.log('FARK  ' + ad + (info ? '\n   ' + info : '')) } };

// Görünüm senaryoları: [ad, işlemler, beklenen kutu metni, beklenen .value]
const UI = [
  ['tam sayı', [['type', '2223402']], '2.223.402', '2223402'],
  ['virgüllü kuruş', [['type', '22234,5']], '22.234,5', '22234.5'],
  ['elle yazılan nokta binliktir', [['type', '33.030']], '33.030', '33030'],
  ['nokta kuruş yerine geçmez (Türkçe yazım)', [['type', '1500.75']], '150.075', '150075'],
  ['nokta ve virgül birlikte', [['type', '2.223.402,5']], '2.223.402,5', '2223402.5'],
  ['en çok iki kuruş hanesi', [['type', '123,456']], '123,45', '123.45'],
  ['ikinci virgül yok sayılır', [['type', '12,3,4']], '12,34', '12.34'],
  ['harf girilmez', [['type', '12a3b4']], '1.234', '1234'],
  ['baştaki sıfır', [['type', '0045000']], '45.000', '45000'],
  ['yapıştır: Türkçe biçim', [['paste', '2.223.402,50']], '2.223.402,50', '2223402.50'],
  ['yapıştır: noktalı ondalık', [['paste', '45000.37']], '45.000,37', '45000.37'],
  ['yapıştır: İngilizce biçim', [['paste', '1,234,567.89']], '1.234.567,89', '1234567.89'],
  ['yapıştır: TL yazılı', [['paste', '12.500 TL']], '12.500', '12500'],
  ['yapıştır: ₺ işaretli', [['paste', '₺33.030,00']], '33.030,00', '33030.00'],
  ['yapıştır: araya ekleme', [['type', '1000'], ['caret', 1], ['paste', '5']], '15.000', '15000'],
  ['geri silme noktanın üstünde', [['type', '1234567'], ['caret', 2], ['press', 'Backspace']], '234.567', '234567'],
  ['ileri silme noktanın üstünde', [['type', '1234567'], ['caret', 1], ['press', 'Delete']], '134.567', '134567'],
  ['araya rakam ekleme', [['type', '1234567'], ['caret', 1], ['type', '9']], '19.234.567', '19234567'],
  ['son haneyi silme', [['type', '1234'], ['press', 'Backspace']], '123', '123'],
  ['tümünü seçip yeniden yazma', [['type', '999999'], ['selectAll'], ['type', '45000']], '45.000', '45000'],
  ['değer atama (program)', [['set', '45000.37']], '45.000,37', '45000.37'],
  ['boş bırakma', [['type', '12'], ['press', 'Backspace'], ['press', 'Backspace']], '', ''],
];

async function run(p, sel, steps) {
  const loc = p.locator(sel);
  await loc.click(); await p.keyboard.press('ControlOrMeta+A'); await p.keyboard.press('Backspace');
  for (const [op, arg] of steps) {
    if (op === 'type') await loc.pressSequentially(arg);
    else if (op === 'press') await p.keyboard.press(arg);
    else if (op === 'caret') await loc.evaluate((e, n) => e.setSelectionRange(n, n), arg);
    else if (op === 'selectAll') await loc.evaluate(e => e.select());
    else if (op === 'paste') { await p.evaluate(t => navigator.clipboard.writeText(t), arg); await p.keyboard.press('ControlOrMeta+V') }
    else if (op === 'set') await loc.evaluate((e, v) => { e.value = v }, arg);
  }
  return loc.evaluate(e => [Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').get.call(e), e.value, e.type, e.inputMode]);
}

// Sayfa bazlı uçtan uca: [sayfa, sekme, buton, sonuç, sabit alanlar, tutar alanları {id: [atanan, klavye]}]
const E2E = [
  ['kidem-tazminati-hesaplama', null, 'main button[data-tool]', 'result', { start: '2015-03-01', end: '2026-10-15' }, { salary: ['45000.5', '45000,5'], cap: ['64948.77', '64948,77'] }],
  ['ihbar-tazminati-hesaplama', null, 'main button[data-tool]', 'result', { months: '40' }, { salary: ['2223402', '2223402'] }],
  ['fazla-mesai-hesaplama', null, 'main button[data-tool]', 'result', { hours: '12' }, { salary: ['33030', '33.030'] }],
  ['yillik-izin-ucreti-hesaplama', null, 'main button[data-tool]', 'result', { days: '14' }, { salary: ['28500.25', '28500,25'] }],
  ['yasal-faiz-hesaplama', null, 'main button[data-tool]', 'result', { rate: '24', start: '2024-01-01', end: '2026-06-30' }, { principal: ['1250000', '1250000'] }],
  ['kira-artis-hesaplama', null, '#kiraBtn', 'kiraResult', { tufe: '33.4', sozlesme: '' }, { kira: ['18750', '18750'] }],
  ['nafaka-artis-hesaplama', null, '#nafakaBtn', 'nafakaResult', { oran: '31.07', ay: '5' }, { nafaka: ['7500', '7.500'] }],
  ['maas-haczi-hesaplama', null, '#hacizBtn', 'hacizResult', { tur: 'calisan', oran: '25' }, { maas: ['42000', '42000'], borc: ['250000', '250.000'], onceki: ['80000.5', '80000,50'] }],
  ['issizlik-maasi-hesaplama', null, '#issizBtn', 'issizResult', { primGun: '1000', son120: 'evet', neden: 'evet' }, { ay1: ['52000', '52000'], ay2: ['52000', '52.000'], ay3: ['54500.4', '54500,4'], ay4: ['54500.4', '54500,40'] }],
  ['miras-payi-hesaplama', null, '#mirasBtn', 'mirasResult', { es: 'evet', cocuk: '2' }, { tereke: ['1200000', '1200000'] }],
  ['index', '.calc-tabs button[data-tab="kidem"]', '#kidem .calc-btn', 'kidemResult', { kidemStart: '2015-03-01', kidemEnd: '2026-10-15' }, { kidemSalary: ['45000.5', '45000,5'], kidemCap: ['64948.77', '64948,77'] }],
  ['index', '.calc-tabs button[data-tab="ihbar"]', '#ihbar .calc-btn', 'ihbarResult', { ihbarMonths: '40' }, { ihbarSalary: ['2223402', '2223402'] }],
  ['index', '.calc-tabs button[data-tab="mesai"]', '#mesai .calc-btn', 'mesaiResult', { mesaiHours: '12' }, { mesaiSalary: ['33030', '33030'] }],
  ['index', '.calc-tabs button[data-tab="izin"]', '#izin .calc-btn', 'izinResult', { izinDays: '14' }, { izinSalary: ['28500.25', '28500,25'] }],
  ['index', '.calc-tabs button[data-tab="faiz"]', '#faiz .calc-btn', 'faizResult', { faizRate: '24', faizStart: '2024-01-01', faizEnd: '2026-06-30' }, { faizPrincipal: ['1250000', '1.250.000'] }],
  ['index', '.calc-tabs button[data-tab="kiraTab"]', '#kiraBtn', 'kiraResult', { tufe: '33.4', sozlesme: '' }, { kira: ['18750', '18750'] }],
  ['index', '.calc-tabs button[data-tab="mirasTab"]', '#mirasBtn', 'mirasResult', { es: 'evet', cocuk: '2' }, { tereke: ['1200000', '1200000'] }],
];

(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'] }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  // 1) Görünüm: her tutar kutusunda tüm senaryolar
  const PAGES = ['kidem-tazminati-hesaplama', 'ihbar-tazminati-hesaplama', 'fazla-mesai-hesaplama', 'yillik-izin-ucreti-hesaplama', 'yasal-faiz-hesaplama', 'kira-artis-hesaplama', 'nafaka-artis-hesaplama', 'maas-haczi-hesaplama', 'issizlik-maasi-hesaplama', 'miras-payi-hesaplama', 'index'];
  let kutu = 0;
  for (const pg of PAGES) {
    await p.goto(BASE + pg + '.html');
    const ids = await p.$$eval('input[data-tutar]', a => a.map(e => e.id));
    for (const id of ids) {
      kutu++;
      await p.evaluate(id => { const e = document.getElementById(id); const pnl = e.closest('.calc-panel'); if (pnl) { document.querySelectorAll('.calc-panel').forEach(x => x.classList.remove('active')); pnl.classList.add('active') } }, id);
      for (const [ad, steps, shown, val] of UI) {
        const [d, v, t, im] = await run(p, '#' + id, steps);
        check(`${pg} #${id} ${ad}`, d === shown && v === val && t === 'text' && im === 'decimal', `görünen ${JSON.stringify(d)} beklenen ${JSON.stringify(shown)} | değer ${JSON.stringify(v)} beklenen ${JSON.stringify(val)} | tür ${t}/${im}`);
      }
    }
  }
  check('tutar kutusu sayısı 24', kutu === 24, 'bulunan ' + kutu);
  // 2) Uçtan uca: atanan değer ile klavyeyle biçimli yazılan değer aynı sonucu vermeli
  for (const [pg, tab, btn, out, fixed, money] of E2E) {
    const res = [];
    for (const mode of [0, 1]) {
      await p.goto(BASE + pg + '.html'); if (tab) await p.click(tab);
      await p.evaluate(v => { for (const [k, x] of Object.entries(v)) { const e = document.getElementById(k); e.value = x; e.dispatchEvent(new Event('change')); e.dispatchEvent(new Event('input')) } }, fixed);
      for (const [id, [setv, typed]] of Object.entries(money)) {
        if (mode === 0) await p.evaluate(([id, v]) => { document.getElementById(id).value = v }, [id, setv]);
        else { const l = p.locator('#' + id); await l.click(); await p.keyboard.press('ControlOrMeta+A'); await p.keyboard.press('Backspace'); await l.pressSequentially(typed) }
      }
      await p.click(btn);
      res.push(await p.evaluate(o => document.getElementById(o).innerText.replace(/\s+/g, ' ').trim(), out));
    }
    check(`uçtan uca ${pg}${tab ? ' ' + tab.match(/"(.+)"/)[1] : ''}`, res[0] === res[1] && /₺|\d\/\d/.test(res[0]), `atanan: ${res[0].slice(0, 140)}\n   yazılan: ${res[1].slice(0, 140)}`);
  }
  check('sayfa hatası yok', errs.length === 0, errs.join(' | '));
  console.log(`BİÇİM ${ok}/${ok + bad}`);
  await b.close(); process.exit(bad ? 1 : 0);
})();
