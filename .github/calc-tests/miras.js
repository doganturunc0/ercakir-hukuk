// Miras payı aracı: TMK m.495–501 ve m.506'ya göre elle hesaplanmış senaryolar.
// Kullanım: BASE=http://127.0.0.1:8000/ node .github/calc-tests/miras.js
const {chromium}=require('playwright');const BASE=process.env.BASE||'http://127.0.0.1:8000/';
// Beklenen paylar TMK m.495-499 ve m.506'dan elle hesaplanmıştır: [mirasçı metni parçası, yasal pay, saklı pay]
const S=[
['S1 eş + 2 çocuk',{es:'evet',cocuk:'2',tereke:'1200000'},[['Sağ kalan eş','1/4','1/4'],['Her bir çocuk','3/8','3/16']],['₺300.000,00','₺450.000,00']],
['S2 eş yok + 3 çocuk',{es:'hayir',cocuk:'3'},[['Her bir çocuk','1/3','1/6']]],
['S3 eş + 1 çocuk + önce ölen çocuğun 2 çocuğu',{es:'evet',cocuk:'1',olenCocuk:'2'},[['Sağ kalan eş','1/4','1/4'],['Her bir çocuk','3/8','3/16'],['çocuğun her bir çocuğu','3/16','3/32']]],
['S4 eş + anne + baba',{es:'evet',cocuk:'0',anne:'evet',baba:'evet'},[['Sağ kalan eş','1/2','1/2'],['Anne','1/4','1/16'],['Baba','1/4','1/16']]],
['S5 eş + anne, baba ölü, 2 tam kardeş',{es:'evet',cocuk:'0',anne:'evet',baba:'hayir',tamKardes:'2'},[['Sağ kalan eş','1/2','1/2'],['Anne','1/4','1/16'],['ana-baba bir kardeş','1/8','—']]],
['S6 eş yok, anne-baba ölü, 1 tam + 1 ana bir + 1 baba bir kardeş',{es:'hayir',cocuk:'0',anne:'hayir',baba:'hayir',tamKardes:'1',anaKardes:'1',babaKardes:'1'},[['ana-baba bir kardeş','1/2','—'],['ana bir kardeş','1/4','—'],['baba bir kardeş','1/4','—']]],
['S7 eş + yalnızca büyükanne-büyükbaba zümresi',{es:'evet',cocuk:'0',anne:'hayir',baba:'hayir',zumre3:'evet'},[['Sağ kalan eş','3/4','9/16'],['Büyükanne-büyükbaba','1/4','—']]],
['S8 yalnızca eş',{es:'evet',cocuk:'0',anne:'hayir',baba:'hayir',zumre3:'hayir'},[['Sağ kalan eş','1','3/4']]],
['S9 eş yok, anne sağ, baba ölü, kardeş yok',{es:'hayir',cocuk:'0',anne:'evet',baba:'hayir'},[['Anne','1','1/4']]],
['S10 kimse yok',{es:'hayir',cocuk:'0',anne:'hayir',baba:'hayir',zumre3:'hayir'},'Devlete'],
['S11 eş + önce ölen tek çocuğun 3 çocuğu',{es:'evet',cocuk:'0',olenCocuk:'3'},[['Sağ kalan eş','1/4','1/4'],['çocuğun her bir çocuğu','1/4','1/8']]],
['S12 eş + ölen çocuk çocuksuz + anne + baba',{es:'evet',cocuk:'0',olenCocuk:'0',anne:'evet',baba:'evet'},[['Sağ kalan eş','1/2','1/2'],['Anne','1/4','1/16'],['Baba','1/4','1/16']]],
];
(async()=>{const b=await chromium.launch();const p=await b.newPage();let ok=0;
for(const [ad,v,exp,amt] of S){await p.goto(BASE+'miras-payi-hesaplama.html');
 const rows=await p.evaluate(v=>{for(const [k,x] of Object.entries(v)){const e=document.getElementById(k);e.value=x;e.dispatchEvent(new Event('change'));e.dispatchEvent(new Event('input'))}document.getElementById('mirasBtn').click();
  const r=document.getElementById('mirasResult');const tr=[...r.querySelectorAll('tbody tr')].map(t=>[...t.cells].map(c=>c.innerText.replace(/\s+/g,' ').trim()));return {tr,txt:r.innerText.replace(/\s+/g,' ')}},v);
 let pass;
 if(exp==='Devlete') pass=rows.txt.includes('Devlete');
 else pass=exp.length===rows.tr.length&&exp.every(([n,y,s])=>rows.tr.some(r=>r[0].includes(n)&&r[1].split(' ')[0]===y&&r[2].split(' ')[0]===s))&&(!amt||amt.every(a=>rows.txt.includes(a)));
 if(pass)ok++;console.log((pass?'DOĞRU ':'FARK  ')+ad+(pass?'':'\n   gelen: '+JSON.stringify(rows.tr)+' '+rows.txt.slice(-160)));}
console.log(`MİRAS ${ok}/${S.length}`);await b.close();process.exit(ok===S.length?0:1)})();
