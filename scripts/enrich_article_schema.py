"""Makale (Article) şemasını sayfadaki bilgilerle zenginleştirir; tekrar çalıştırılabilir (idempotent).

- description: sayfanın meta açıklaması
- about: başlığın üstündeki konu etiketi (ör. "AİLE HUKUKU · ..." → "Aile hukuku")
- citation: "Kaynaklar" bölümündeki resmî kaynak bağlantıları (ad + adres)
- Büro (LegalService) nesnelerine knowsAbout (faaliyet alanları) eklenir.

Kullanım: python3 scripts/enrich_article_schema.py [kök_dizin]
"""
import glob
import html
import json
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
KNOWS = ['Ceza hukuku', 'Aile ve boşanma hukuku', 'İş hukuku', 'İcra ve iflas hukuku', 'Gayrimenkul hukuku',
         'Miras hukuku', 'Kira hukuku', 'Ticaret hukuku', 'İdare hukuku', 'Sigorta hukuku']
LD = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)


def tr_sentence(s):
    s = s.strip()
    low = s.replace('I', 'ı').replace('İ', 'i').lower()
    return low[:1].replace('i', 'İ').upper() + low[1:] if low else low


def text(x):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', x))).strip()


changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
    src = open(path, encoding='utf-8').read()
    is_article = 'class="article-page"' in src
    m = re.search(r'<meta name="description" content="([^"]*)"', src)
    desc = html.unescape(m.group(1)) if m else None
    m = re.search(r'<p class="eyebrow">([^<]*)</p>\s*<h1', src)
    about = tr_sentence(html.unescape(m.group(1)).split('·')[0]) if m else None
    cites = []
    m = re.search(r'class="sources-block"([\s\S]*?)</ul>', src)
    if m:
        for href, name in re.findall(r'<a href="(https?://[^"]+)"[^>]*>(.*?)</a>', m.group(1), re.S):
            cites.append({'@type': 'CreativeWork', 'name': text(name), 'url': html.unescape(href)})

    def fix(mm):
        g = json.loads(mm.group(1))
        objs = g.get('@graph', [g]) if isinstance(g, dict) else g
        for o in objs:
            t = o.get('@type'); t = t if isinstance(t, list) else [t]
            if is_article and 'Article' in t:
                if desc: o['description'] = desc
                if about: o['about'] = {'@type': 'Thing', 'name': about}
                if cites: o['citation'] = cites
            if 'LegalService' in t and 'name' in o:
                o.setdefault('knowsAbout', KNOWS)
        return '<script type="application/ld+json">' + json.dumps(g, ensure_ascii=False, separators=(',', ':')) + '</script>'

    out = LD.sub(fix, src)
    if out != src:
        for block in LD.findall(out):
            json.loads(block)
        open(path, 'w', encoding='utf-8').write(out)
        changed += 1
print('şema güncellenen dosya:', changed)
