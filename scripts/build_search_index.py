#!/usr/bin/env python3
"""Build search-index.json for the in-site search on hukuki-icerikler.html.
Usage: python3 scripts/build_search_index.py [site_dir]   (default: repository root)
Indexes every page listed in sitemap.xml except the home page and legal notices."""
import html, json, re, sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
SKIP = {'index.html', 'kvkk-aydinlatma-metni.html', 'gizlilik-cerez-politikasi.html', 'hukuki-icerikler.html'}
NOT_HEAD = {'İlgili içerikler', 'Başlıca kaynaklar', 'Sık sorulan sorular', 'Sık Sorulan Sorular'}

def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

sitemap = (root / 'sitemap.xml').read_text(encoding='utf-8')
pages = [u.split('/')[-1] for u in re.findall(r'<loc>https://avbusraturunc\.com/([^<]*)</loc>', sitemap)]
items = []
for name in pages:
    if not name.endswith('.html') or name in SKIP:
        continue
    p = root / name
    if not p.exists():
        continue
    s = p.read_text(encoding='utf-8')
    if re.search(r'<meta name="robots" content="[^"]*noindex', s):
        continue
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    title = clean(h1.group(1)) if h1 else clean(re.search(r'<title>(.*?)</title>', s, re.S).group(1))
    desc = re.search(r'<meta name="description" content="([^"]*)"', s)
    eyebrow = re.search(r'<p class="eyebrow">([^<]*)</p>', s)
    heads = [clean(h) for h in re.findall(r'<h2[^>]*>(.*?)</h2>', s, re.S)]
    heads = [h for h in heads if h and h not in NOT_HEAD]
    items.append({
        'u': name,
        't': title,
        'c': clean(eyebrow.group(1)).split('·')[0].strip() if eyebrow else '',
        'd': html.unescape(desc.group(1)) if desc else '',
        'h': ' | '.join(heads),
    })
items.sort(key=lambda x: x['t'])
(root / 'search-index.json').write_text(json.dumps(items, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'search-index.json: {len(items)} sayfa')
