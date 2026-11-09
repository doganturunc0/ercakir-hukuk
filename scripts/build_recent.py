#!/usr/bin/env python3
"""Ana sayfadaki "Son eklenen içerikler" bloğunu üretir.

Makaleler JSON-LD içindeki datePublished tarihine göre sıralanır; aynı gün
yayımlananlarda dosyanın depoya ilk eklendiği commit zamanı esas alınır.
Blok index.html içinde <!-- recent:start --> ile <!-- recent:end -->
işaretleri arasına yazılır. Kullanım: python3 scripts/build_recent.py .
"""
import html
import json
import os
import re
import subprocess
import sys

COUNT = 4
AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos',
      'Eylül', 'Ekim', 'Kasım', 'Aralık']
START, END = '<!-- recent:start -->', '<!-- recent:end -->'


def added_at(root, name):
    try:
        out = subprocess.run(['git', 'log', '--diff-filter=A', '--format=%ct', '--', name],
                             cwd=root, capture_output=True, text=True, check=True).stdout.split()
        if out:
            return int(out[-1])
    except (OSError, subprocess.CalledProcessError):
        pass
    # Henüz commit edilmemiş yeni dosya: en yeni sayılır.
    return int(os.path.getmtime(os.path.join(root, name)))


def short_title(title):
    title = title.strip()
    for sep in (':', '?'):
        i = title.find(sep)
        if 0 < i < len(title) - 1:
            return title[:i + (1 if sep == '?' else 0)].strip()
    return title


def main(root):
    index = {x['u']: x for x in json.load(open(os.path.join(root, 'search-index.json'), encoding='utf-8'))}
    rows = []
    for name in sorted(os.listdir(root)):
        if not name.endswith('.html'):
            continue
        text = open(os.path.join(root, name), encoding='utf-8').read()
        if 'article-enhance.js' not in text or name not in index:
            continue
        m = re.search(r'"datePublished":"(\d{4}-\d{2}-\d{2})', text)
        if not m:
            continue
        rows.append((m.group(1), added_at(root, name), name))
    rows.sort(key=lambda r: (r[0], r[1], r[2]), reverse=True)
    items = []
    for date, _, name in rows[:COUNT]:
        x = index[name]
        y, mo, d = (int(p) for p in date.split('-'))
        items.append(
            f'<li><a href="{name}"><span class="recent-tag">{html.escape(x.get("c", ""), quote=False)}</span>'
            f'<span class="recent-name">{html.escape(short_title(x["t"]), quote=False)}</span>'
            f'<time datetime="{date}">{d} {AY[mo - 1]} {y}</time></a></li>')
    block = (f'{START}<div class="recent-content"><p class="recent-heading">Son eklenen içerikler</p>'
             f'<ul class="recent-list">{"".join(items)}</ul></div>{END}')
    path = os.path.join(root, 'index.html')
    page = open(path, encoding='utf-8').read()
    if START in page:
        page = re.sub(re.escape(START) + '.*?' + re.escape(END), lambda _: block, page, count=1, flags=re.S)
    else:
        anchor = '<a class="all-articles-link" href="hukuki-icerikler.html">'
        if page.count(anchor) != 1:
            sys.exit('anchor not found')
        page = page.replace(anchor, block + anchor, 1)
    open(path, 'w', encoding='utf-8').write(page)
    print('recent:', ', '.join(r[2] for r in rows[:COUNT]))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
