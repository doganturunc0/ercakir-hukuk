from pathlib import Path
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
ORG_ID = "https://avbusraturunc.com/#ercakir-hukuk"

# Editorial pages were embedding the same LegalService/Organization object inside
# Article.publisher without its PostalAddress. Keep the canonical business entity
# on the canonical pages and reference it from articles by @id.
old_publisher = ('"publisher":{"@type":["LegalService","Organization"],'
                 '"@id":"https://avbusraturunc.com/#ercakir-hukuk",'
                 '"name":"Erçakır Hukuk Bürosu","url":"https://avbusraturunc.com/"}')
new_publisher = '"publisher":{"@id":"https://avbusraturunc.com/#ercakir-hukuk"}'

# The infaz tool intentionally contains a local business entity in the same graph.
# It must therefore carry the verified office PostalAddress, matching index/about.
old_infaz_org = ('{"@type":["LegalService","Organization"],'
                 '"@id":"https://avbusraturunc.com/#ercakir-hukuk",'
                 '"name":"Erçakır Hukuk Bürosu","url":"https://avbusraturunc.com/",'
                 '"areaServed":[{"@type":"City","name":"Salihli"},{"@type":"AdministrativeArea","name":"Manisa"}],'
                 '"employee":{"@id":"https://avbusraturunc.com/#busra-turunc"}}')
new_infaz_org = ('{"@type":["LegalService","Organization"],'
                 '"@id":"https://avbusraturunc.com/#ercakir-hukuk",'
                 '"name":"Erçakır Hukuk Bürosu","url":"https://avbusraturunc.com/",'
                 '"address":{"@type":"PostalAddress",'
                 '"streetAddress":"Zafer Mahallesi, Belediye Caddesi, Zaroğlu İş Merkezi No: 71/1, Kat: 3, No: 316",'
                 '"addressLocality":"Salihli","addressRegion":"Manisa","postalCode":"45300","addressCountry":"TR"},'
                 '"areaServed":[{"@type":"City","name":"Salihli"},{"@type":"AdministrativeArea","name":"Manisa"}],'
                 '"employee":{"@id":"https://avbusraturunc.com/#busra-turunc"}}')

changed = []
publisher_replacements = 0
for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    original = text
    n = text.count(old_publisher)
    if n:
        text = text.replace(old_publisher, new_publisher)
        publisher_replacements += n
    if path.name == "infaz-hesaplama.html" and old_infaz_org in text:
        text = text.replace(old_infaz_org, new_infaz_org)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed.append(path.name)

# Parse every JSON-LD block after the edit. Any malformed block aborts the workflow.
jsonld_blocks = 0
errors = []
pattern = re.compile(r'<script\s+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.I | re.S)
for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    for idx, block in enumerate(pattern.findall(text), 1):
        jsonld_blocks += 1
        try:
            json.loads(block.strip())
        except Exception as exc:
            errors.append(f"{path.name} JSON-LD #{idx}: {exc}")

if errors:
    print("JSON-LD validation failed:")
    print("\n".join(errors))
    sys.exit(1)

# Regression guard: no embedded Article.publisher LegalService object may remain
# in the root HTML set with the known missing-address shape.
remaining = []
for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    if old_publisher in text:
        remaining.append(path.name)
if remaining:
    print("Unnormalized publisher objects remain:", remaining)
    sys.exit(1)

print(f"publisher_replacements={publisher_replacements}")
print(f"changed_files={len(changed)}")
print("changed=" + ",".join(changed))
print(f"jsonld_blocks_validated={jsonld_blocks}")
