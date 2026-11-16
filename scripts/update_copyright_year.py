"""Alt bilgideki telif yılını yayın anındaki yıla (Türkiye saati) getirir.

Kullanım: python3 scripts/update_copyright_year.py [kök_dizin]
"""
import datetime
import glob
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
YEAR = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=3)).year
PAT = re.compile(r'© \d{4} Erçakır Hukuk Bürosu')
changed = 0
for path in glob.glob(os.path.join(ROOT, '*.html')):
    src = open(path, encoding='utf-8').read()
    out = PAT.sub(f'© {YEAR} Erçakır Hukuk Bürosu', src)
    if out != src:
        open(path, 'w', encoding='utf-8').write(out)
        changed += 1
print(f'telif yılı {YEAR}: {changed} dosya güncellendi')
