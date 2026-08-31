from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

replacements = {
    "index.html": [
        ("<title>Salihli Avukat | Av. Büşra Turunç | Erçakır Hukuk Bürosu</title>", "<title>Av. Büşra Turunç | Erçakır Hukuk Bürosu | Salihli, Manisa</title>"),
        ("<link rel=\"stylesheet\" href=\"styles.css\">", "<link rel=\"stylesheet\" href=\"styles.css\">\n<link rel=\"stylesheet\" href=\"compliance.css\">"),
    ],
    "ceza-hukuku.html": [
        ("<title>Salihli Ceza Avukatı ve Ceza Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Ceza Hukuku | Av. Büşra Turunç</title>"),
        ("content=\"Salihli Ceza Avukatı ve Ceza Hukuku | Av. Büşra Turunç\"", "content=\"Salihli Ceza Hukuku | Av. Büşra Turunç\""),
        ("\"headline\":\"Salihli Ceza Avukatı ve Ceza Hukuku Süreçleri\"", "\"headline\":\"Salihli Ceza Hukuku Süreçleri\""),
        ("<h1>Salihli ceza avukatı ve ceza hukuku süreçleri</h1>", "<h1>Salihli'de ceza hukuku süreçleri</h1>"),
    ],
    "aile-bosanma-hukuku.html": [
        ("<title>Salihli Boşanma Avukatı ve Aile Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Aile ve Boşanma Hukuku | Av. Büşra Turunç</title>"),
        ("content=\"Salihli Boşanma Avukatı ve Aile Hukuku | Av. Büşra Turunç\"", "content=\"Salihli Aile ve Boşanma Hukuku | Av. Büşra Turunç\""),
        ("\"headline\":\"Salihli Boşanma Avukatı ve Aile Hukuku Süreçleri\"", "\"headline\":\"Salihli Aile ve Boşanma Hukuku Süreçleri\""),
        ("<h1>Salihli boşanma avukatı ve aile hukuku süreçleri</h1>", "<h1>Salihli'de aile ve boşanma hukuku süreçleri</h1>"),
    ],
    "is-hukuku.html": [
        ("<title>Salihli İş Hukuku Avukatı | İşçi ve İşveren Uyuşmazlıkları</title>", "<title>Salihli İş Hukuku | İşçi ve İşveren Uyuşmazlıkları</title>"),
    ],
    "icra-iflas-hukuku.html": [
        ("<title>Salihli İcra Avukatı ve İcra Hukuku | Av. Büşra Turunç</title>", "<title>Salihli İcra ve İflas Hukuku | Av. Büşra Turunç</title>"),
        ("\"headline\":\"Salihli İcra Avukatı ve İcra Hukuku Süreçleri\"", "\"headline\":\"Salihli İcra ve İflas Hukuku Süreçleri\""),
        ("<h1>Salihli icra avukatı ve icra hukuku süreçleri</h1>", "<h1>Salihli'de icra ve iflas hukuku süreçleri</h1>"),
    ],
    "gayrimenkul-hukuku.html": [
        ("<title>Salihli Gayrimenkul Avukatı ve Taşınmaz Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Gayrimenkul ve Taşınmaz Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli gayrimenkul avukatı ve taşınmaz hukuku süreçleri</h1>", "<h1>Salihli'de gayrimenkul ve taşınmaz hukuku süreçleri</h1>"),
    ],
    "miras-hukuku.html": [
        ("<title>Salihli Miras Avukatı ve Miras Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Miras Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli miras avukatı ve miras hukuku süreçleri</h1>", "<h1>Salihli'de miras hukuku süreçleri</h1>"),
    ],
    "ticaret-hukuku.html": [
        ("<title>Salihli Ticaret Avukatı ve Ticaret Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Ticaret Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli ticaret avukatı ve ticaret hukuku süreçleri</h1>", "<h1>Salihli'de ticaret hukuku süreçleri</h1>"),
    ],
    "idare-hukuku.html": [
        ("<title>Salihli İdare Avukatı ve İdare Hukuku | Av. Büşra Turunç</title>", "<title>Salihli İdare Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli idare avukatı ve idare hukuku süreçleri</h1>", "<h1>Salihli'de idare hukuku süreçleri</h1>"),
    ],
    "kira-hukuku.html": [
        ("<title>Salihli Kira Avukatı ve Kira Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Kira Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli kira avukatı ve kira hukuku süreçleri</h1>", "<h1>Salihli'de kira hukuku süreçleri</h1>"),
    ],
    "sigorta-hukuku.html": [
        ("<title>Salihli Sigorta Avukatı ve Sigorta Hukuku | Av. Büşra Turunç</title>", "<title>Salihli Sigorta Hukuku | Av. Büşra Turunç</title>"),
        ("<h1>Salihli sigorta avukatı ve sigorta hukuku süreçleri</h1>", "<h1>Salihli'de sigorta hukuku süreçleri</h1>"),
    ],
}

changed = []
for name, pairs in replacements.items():
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in pairs:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed.append(name)

# Catch exact-match local-practice keyword strings that may remain in other HTML files.
neutral = {
    "Salihli ceza avukatı": "Salihli ceza hukuku",
    "Salihli Ceza Avukatı": "Salihli Ceza Hukuku",
    "Salihli boşanma avukatı": "Salihli aile ve boşanma hukuku",
    "Salihli Boşanma Avukatı": "Salihli Aile ve Boşanma Hukuku",
    "Salihli iş hukuku avukatı": "Salihli iş hukuku",
    "Salihli İş Hukuku Avukatı": "Salihli İş Hukuku",
    "Salihli icra avukatı": "Salihli icra ve iflas hukuku",
    "Salihli İcra Avukatı": "Salihli İcra ve İflas Hukuku",
    "Salihli gayrimenkul avukatı": "Salihli gayrimenkul hukuku",
    "Salihli Gayrimenkul Avukatı": "Salihli Gayrimenkul Hukuku",
    "Salihli miras avukatı": "Salihli miras hukuku",
    "Salihli Miras Avukatı": "Salihli Miras Hukuku",
    "Salihli ticaret avukatı": "Salihli ticaret hukuku",
    "Salihli Ticaret Avukatı": "Salihli Ticaret Hukuku",
    "Salihli idare avukatı": "Salihli idare hukuku",
    "Salihli İdare Avukatı": "Salihli İdare Hukuku",
    "Salihli kira avukatı": "Salihli kira hukuku",
    "Salihli Kira Avukatı": "Salihli Kira Hukuku",
    "Salihli sigorta avukatı": "Salihli sigorta hukuku",
    "Salihli Sigorta Avukatı": "Salihli Sigorta Hukuku",
}
for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in neutral.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        if path.name not in changed:
            changed.append(path.name)

print("patched:", ", ".join(sorted(changed)))
