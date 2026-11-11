#!/usr/bin/env python3
"""Ana sayfanın stil dosyalarını tek bir home.css dosyasında birleştirir.

Dosyalar ana sayfadaki önceki yükleme sırasıyla birleştirilir; böylece kuralların
öncelik sırası değişmez. Kaynak dosyalar diğer sayfalarda kullanılmaya devam eder.
Kullanım: python3 scripts/build_home_css.py [kök klasör]
"""
import os
import sys

SOURCES = ['site.css', 'home-polish.css', 'practice-cards.css', 'analytics-consent.css',
           'consent-banner.css', 'hesaplama-tema.css', 'map-consent.css', 'map-compact.css',
           'floating-contact.css', 'site-chrome.css', 'home-fixes.css']


def main(root):
    parts = ['/* Bu dosya scripts/build_home_css.py ile üretilir; doğrudan düzenlemeyin. Kaynaklar: '
             + ', '.join(SOURCES) + ' */']
    for name in SOURCES:
        css = open(os.path.join(root, name), encoding='utf-8').read().strip()
        parts.append(f'/* ---- {name} ---- */\n{css}')
    open(os.path.join(root, 'home.css'), 'w', encoding='utf-8').write('\n'.join(parts) + '\n')
    print('home.css:', len(SOURCES), 'kaynak')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
