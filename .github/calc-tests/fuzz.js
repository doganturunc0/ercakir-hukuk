// Rastgele girdiyle fark testi: her aracın sonucu, kanun kurallarından ayrıca yazılmış referans hesapla karşılaştırılır.
// Kullanım: BASE=http://127.0.0.1:8000/ N=200 node .github/calc-tests/fuzz.js  (tohum sabit; her çalıştırmada aynı girdiler)
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8000/';
const N = +(process.env.N || 200);
let seed = 20261115; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
const rf = (a, b, d = 2) => +(a + rnd() * (b - a)).toFixed(d);
const pad = n => String(n).padStart(2, '0');
const rdate = (y1, y2) => `${ri(y1, y2)}-${pad(ri(1, 12))}-${pad(ri(1, 28))}`;
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const r2 = x => Math.round(x * 100) / 100;
const money = t => [...t.matchAll(/(-?)₺([\d.]+,\d{2})/g)].map(m => (m[1] ? -1 : 1) * +m[2].replace(/\./g, '').replace(',', '.'));
const near = (a, b) => Math.abs(a - b) <= 0.011;
// İş Kanunu m.17: <6 ay 2 hf; 6 ay–1,5 yıl 4 hf; 1,5–3 yıl 6 hf; >3 yıl 8 hf (18. ay sınırı sitede 6 hafta kabul edilmiş)
const ihbarHafta = m => m < 6 ? 2 : m < 18 ? 4 : m <= 36 ? 6 : 8;

const T = [
 { name: 'Kıdem (sayfa)', page: 'kidem-tazminati-hesaplama', btn: 'main button[data-tool]', out: 'result',
   gen: () => { const s = rdate(2000, 2025); let e = rdate(2001, 2026); if (e <= s) e = rdate(2026, 2026); return { start: s, end: e, salary: String(ri(17000, 250000)), cap: String(rf(30000, 80000)) } },
   ref: v => { const d = days(v.start, v.end); if (d <= 0) return 'err'; if (d < 365) return 'yil'; return [r2(Math.min(+v.salary, +v.cap) * d / 365)] } },
 { name: 'İhbar (sayfa)', page: 'ihbar-tazminati-hesaplama', btn: 'main button[data-tool]', out: 'result',
   gen: () => ({ months: String(rnd() < .3 ? ri(0, 60) : rf(0, 400, 1)), salary: String(ri(17000, 250000)) }),
   ref: v => [r2(+v.salary / 30 * 7 * ihbarHafta(+v.months))] },
 { name: 'Fazla mesai (sayfa)', page: 'fazla-mesai-hesaplama', btn: 'main button[data-tool]', out: 'result',
   gen: () => ({ salary: String(ri(17000, 250000)), hours: String(rf(0, 270, 1)) }),
   ref: v => [r2(+v.salary / 225 * 1.5 * +v.hours)] },
 { name: 'Yıllık izin (sayfa)', page: 'yillik-izin-ucreti-hesaplama', btn: 'main button[data-tool]', out: 'result',
   gen: () => ({ salary: String(ri(17000, 250000)), days: String(ri(0, 200)) }),
   ref: v => [r2(+v.salary / 30 * +v.days)] },
 { name: 'Faiz (sayfa)', page: 'yasal-faiz-hesaplama', btn: 'main button[data-tool]', out: 'result',
   gen: () => { const s = rdate(2015, 2026); let e = rdate(2015, 2027); if (e < s) [e] = [rdate(2027, 2027)]; return { principal: String(ri(100, 5000000)), rate: String(rf(1, 80)), start: s, end: e } },
   ref: v => { const d = days(v.start, v.end); const i = +v.principal * +v.rate / 100 * d / 365; return [r2(+v.principal + i), r2(i)] } },
 { name: 'Kira artışı', page: 'kira-artis-hesaplama', btn: '#kiraBtn', out: 'kiraResult',
   gen: () => ({ kira: String(ri(1000, 200000)), tufe: String(rf(0, 90)), sozlesme: rnd() < .3 ? '' : String(rf(0, 120)) }),
   ref: v => { const k = +v.kira, t = +v.tufe; if (v.sozlesme === '') return [r2(k * (1 + t / 100))]; const o = Math.min(+v.sozlesme, t); return [r2(k * (1 + o / 100))] } },
 { name: 'Nafaka artışı', page: 'nafaka-artis-hesaplama', btn: '#nafakaBtn', out: 'nafakaResult',
   gen: () => ({ nafaka: String(ri(500, 100000)), oran: String(rf(0, 100)), ay: rnd() < .4 ? '' : String(ri(0, 36)) }),
   ref: v => { const y = r2(+v.nafaka * (1 + +v.oran / 100)), f = r2(y - +v.nafaka); const a = [y, f, r2(f * 12)]; if (v.ay !== '' && +v.ay > 0) a.push(r2(f * +v.ay)); return a } },
 { name: 'Maaş haczi', page: 'maas-haczi-hesaplama', btn: '#hacizBtn', out: 'hacizResult',
   gen: () => ({ tur: 'calisan', maas: String(ri(10000, 300000)), oran: String(rnd() < .5 ? 25 : rf(25, 100)), borc: String(ri(1000, 3000000)), onceki: rnd() < .5 ? '' : String(ri(0, 1000000)) }),
   ref: v => { const k = r2(+v.maas * +v.oran / 100), s = Math.ceil(+v.borc / k); return [k, r2(+v.maas - k), r2(+v.borc - k * (s - 1))] },
   extra: (v, t) => { const k = r2(+v.maas * +v.oran / 100), s = Math.ceil(+v.borc / k), b = +v.onceki > 0 ? Math.ceil(+v.onceki / k) : 0; return t.includes(s + ' ay') && t.includes((b + s) + ' ay') } },
 { name: 'İşsizlik maaşı', page: 'issizlik-maasi-hesaplama', btn: '#issizBtn', out: 'issizResult',
   gen: () => { const a = ri(20000, 150000); const f = () => String(rnd() < .5 ? a : ri(20000, 150000)); return { ay1: f(), ay2: f(), ay3: f(), ay4: f(), primGun: String(ri(500, 1095)), son120: 'evet', neden: 'evet' } },
   ref: v => { const g = +v.primGun; if (g > 1080) return 'err'; const sure = g >= 1080 ? 300 : g >= 900 ? 240 : g >= 600 ? 180 : 0; if (!sure) return 'prim'; const o = (+v.ay1 + +v.ay2 + +v.ay3 + +v.ay4) / 4; const b = Math.min(r2(o * .4), r2(33030 * .8)); const d = r2(b * .00759), n = r2(b - d); return [n, b, d, r2(n * sure / 30), r2(o)] },
   extra: (v, t) => { const g = +v.primGun; const sure = g >= 1080 ? 300 : g >= 900 ? 240 : g >= 600 ? 180 : 0; return !sure || t.includes(sure + ' gün') } },
 // Ana sayfa (script.js)
 { name: 'Kıdem (ana sayfa)', page: 'index', pre: '.calc-tabs button[data-tab="kidem"]', btn: '#kidem .calc-btn', out: 'kidemResult',
   gen: () => { const s = rdate(2000, 2025); let e = rdate(2001, 2026); if (e <= s) e = rdate(2026, 2026); return { kidemStart: s, kidemEnd: e, kidemSalary: String(ri(17000, 250000)), kidemCap: rnd() < .3 ? '' : String(rf(30000, 80000)) } },
   ref: v => { const d = days(v.kidemStart, v.kidemEnd); if (d <= 0) return 'err'; if (d < 365) return 'yil'; const cap = v.kidemCap === '' ? Infinity : +v.kidemCap; return [r2(Math.min(+v.kidemSalary, cap) * d / 365)] } },
 { name: 'İhbar (ana sayfa)', page: 'index', pre: '.calc-tabs button[data-tab="ihbar"]', btn: '#ihbar .calc-btn', out: 'ihbarResult',
   gen: () => ({ ihbarMonths: String(rnd() < .3 ? ri(0, 60) : rf(0, 400, 1)), ihbarSalary: String(ri(17000, 250000)) }),
   ref: v => [r2(+v.ihbarSalary / 30 * 7 * ihbarHafta(+v.ihbarMonths))] },
 { name: 'Fazla mesai (ana sayfa)', page: 'index', pre: '.calc-tabs button[data-tab="mesai"]', btn: '#mesai .calc-btn', out: 'mesaiResult',
   gen: () => ({ mesaiSalary: String(ri(17000, 250000)), mesaiHours: String(rf(0, 270, 1)) }), ref: v => [r2(+v.mesaiSalary / 225 * 1.5 * +v.mesaiHours)] },
 { name: 'Yıllık izin (ana sayfa)', page: 'index', pre: '.calc-tabs button[data-tab="izin"]', btn: '#izin .calc-btn', out: 'izinResult',
   gen: () => ({ izinSalary: String(ri(17000, 250000)), izinDays: String(ri(0, 200)) }), ref: v => [r2(+v.izinSalary / 30 * +v.izinDays)] },
 { name: 'Faiz (ana sayfa)', page: 'index', pre: '.calc-tabs button[data-tab="faiz"]', btn: '#faiz .calc-btn', out: 'faizResult',
   gen: () => { const s = rdate(2015, 2026); let e = rdate(2015, 2027); if (e < s) e = rdate(2027, 2027); return { faizPrincipal: String(ri(100, 5000000)), faizRate: String(rf(1, 80)), faizStart: s, faizEnd: e } },
   ref: v => { const d = days(v.faizStart, v.faizEnd); const i = +v.faizPrincipal * +v.faizRate / 100 * d / 365; return [r2(i), r2(+v.faizPrincipal + i)] } },
];

(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); let total = 0, bad = 0; const fails = [];
  for (const t of T) {
    await p.goto(BASE + t.page + '.html'); if (t.pre) await p.click(t.pre);
    let ok = 0;
    for (let k = 0; k < N; k++) {
      const v = t.gen();
      const text = await p.evaluate(([v, btn, out]) => {
        for (const [id, val] of Object.entries(v)) { const e = document.getElementById(id); e.value = val; e.dispatchEvent(new Event('change')) }
        document.querySelector(btn).click(); return document.getElementById(out).innerText.replace(/\s+/g, ' ');
      }, [v, t.btn, t.out]);
      const exp = t.ref(v); const got = money(text); total++;
      let pass;
      if (exp === 'yil') pass = /bir yıl/.test(text) && !got.length;
      else if (exp === 'err' || exp === 'prim') pass = !got.length;
      else pass = exp.every(x => got.some(g => near(g, x))) && (!t.extra || t.extra(v, text));
      if (pass) ok++; else { bad++; if (fails.length < 25) fails.push(`${t.name} ${JSON.stringify(v)}\n   beklenen ${JSON.stringify(exp)}\n   gelen    ${text.slice(0, 220)}`) }
    }
    console.log(`${t.name.padEnd(26)} ${ok}/${N}`);
  }
  console.log(`TOPLAM ${total - bad}/${total} doğru`); fails.forEach(f => console.log('FARK: ' + f));
  await b.close(); process.exit(bad ? 1 : 0);
})();
