from pathlib import Path
import html as htmllib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://avbusraturunc.com/'
IMAGE = SITE + 'assets/hero-main.webp'
ALT = 'Avukat Büşra Turunç ve Erçakır Hukuk Bürosu - Salihli, Manisa'


def attr(text, pattern):
    m = re.search(pattern, text, re.I | re.S)
    return htmllib.unescape(m.group(1).strip()) if m else ''


def meta_content(text, name):
    esc = re.escape(name)
    patterns = [
        rf'<meta[^>]+name=["\']{esc}["\'][^>]+content=["\']([^"\']*)["\']',
        rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']{esc}["\']',
    ]
    for p in patterns:
        v = attr(text, p)
        if v:
            return v
    return ''


def prop_content(text, name):
    esc = re.escape(name)
    patterns = [
        rf'<meta[^>]+property=["\']{esc}["\'][^>]+content=["\']([^"\']*)["\']',
        rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]+property=["\']{esc}["\']',
    ]
    for p in patterns:
        v = attr(text, p)
        if v:
            return v
    return ''


def canonical(text):
    return attr(text, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']') or attr(text, r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']')


def title(text):
    return attr(text, r'<title>(.*?)</title>')


def tag(kind, key, value):
    value = htmllib.escape(value, quote=True)
    if kind == 'property':
        return f'<meta property="{key}" content="{value}">'
    return f'<meta name="{key}" content="{value}">'


def add_social_meta(path, text):
    t = title(text)
    d = meta_content(text, 'description')
    c = canonical(text)
    if not (t and d and c):
        return text, []
    additions = []
    is_article = ('article:published_time' in text or 'class="article-page"' in text)
    required_props = {
        'og:type': 'article' if is_article else 'website',
        'og:locale': 'tr_TR',
        'og:title': t,
        'og:description': d,
        'og:url': c,
        'og:site_name': 'Erçakır Hukuk Bürosu',
        'og:image': IMAGE,
        'og:image:alt': ALT,
    }
    for key, value in required_props.items():
        if not prop_content(text, key):
            additions.append(tag('property', key, value))
    required_twitter = {
        'twitter:card': 'summary_large_image',
        'twitter:title': t,
        'twitter:description': d,
        'twitter:image': IMAGE,
    }
    for key, value in required_twitter.items():
        if not meta_content(text, key):
            additions.append(tag('name', key, value))
    if additions:
        block = '\n<!-- Social metadata normalized after verified production audit -->\n' + '\n'.join(additions) + '\n'
        text = text.replace('</head>', block + '</head>', 1)
    return text, additions


def add_internal_links(name, text):
    changed = False
    if name == 'is-hukuku.html' and 'kidem-tazminati-hesaplama.html' not in text:
        block = ('<p><strong>İşçilik hesaplama araçları:</strong> '
                 '<a href="kidem-tazminati-hesaplama.html">kıdem tazminatı hesaplama</a> · '
                 '<a href="ihbar-tazminati-hesaplama.html">ihbar tazminatı hesaplama</a> · '
                 '<a href="fazla-mesai-hesaplama.html">fazla mesai hesaplama</a> · '
                 '<a href="yillik-izin-ucreti-hesaplama.html">yıllık izin ücreti hesaplama</a></p>')
        text = text.replace('</article>', block + '</article>', 1)
        changed = True
    if name == 'icra-iflas-hukuku.html' and 'yasal-faiz-hesaplama.html' not in text:
        block = ('<p><strong>İlgili hesaplama aracı:</strong> '
                 '<a href="yasal-faiz-hesaplama.html">yasal faiz hesaplama</a></p>')
        text = text.replace('</article>', block + '</article>', 1)
        changed = True
    return text, changed


def shorten_whatsapp_description(text):
    old = meta_content(text, 'description')
    if len(old) <= 160:
        return text, False, len(old)
    new = 'WhatsApp yazışmalarının mahkemede delil değeri; aidiyet, bütünlük, ekran görüntüsü ve hukuka uygun elde edilme şartları hakkında genel bilgi.'
    text = re.sub(r'(<meta[^>]+name=["\']description["\'][^>]+content=["\'])[^"\']*(["\'])', lambda m: m.group(1)+new+m.group(2), text, count=1, flags=re.I)
    return text, True, len(new)


def sitemap_html_files():
    ns = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    tree = ET.parse(ROOT/'sitemap.xml')
    result=[]
    for node in tree.findall('.//s:loc', ns):
        url=node.text or ''
        rel=url.replace(SITE,'') or 'index.html'
        if rel.endswith('.html') or rel == 'index.html':
            result.append(rel)
    return result

files = sitemap_html_files()
report = {'files_scanned': len(files), 'social_meta_files_changed': [], 'internal_link_files_changed': [], 'description_changes': [], 'notes': []}

for rel in files:
    path=ROOT/rel
    if not path.exists():
        report['notes'].append(f'missing sitemap target: {rel}')
        continue
    text=path.read_text(encoding='utf-8')
    original=text
    if rel == 'whatsapp-yazismalari-delil-olur-mu.html':
        text, changed, new_len = shorten_whatsapp_description(text)
        if changed:
            report['description_changes'].append({'file': rel, 'new_length': new_len})
    text, additions = add_social_meta(path, text)
    if additions:
        report['social_meta_files_changed'].append({'file': rel, 'tags_added': len(additions)})
    text, linked = add_internal_links(rel, text)
    if linked:
        report['internal_link_files_changed'].append(rel)
    if text != original:
        path.write_text(text, encoding='utf-8')

# Evidence classification for findings that must not be 'fixed' by score-chasing.
report['notes'] += [
    'Indexability is validated separately; no noindex/canonical rewrite is introduced by this remediation.',
    'H2 child spans in the infaz calculator are retained: they are valid HTML used for numbered section headings and do not justify a regression-risking change.',
    'UL/OL and STRONG warnings are not auto-remediated; semantic elements are only used where content requires them.',
    'GTM is not auto-installed; direct analytics/consent architecture is not equivalent to a GTM defect.',
    'Security response headers are not modified in static HTML; HSTS and server/CDN headers require response-layer control.'
]
(ROOT/'sitechecker-hardcore-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
