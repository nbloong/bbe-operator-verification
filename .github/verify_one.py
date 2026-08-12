import base64, json, pathlib, sys
root = pathlib.Path('assets/docs')
oid = sys.argv[1]
data = json.loads((root / f'{oid}.json').read_text(encoding='utf-8'))
card = data.get('card','')
if oid == 'BBE-LM-004':
    cert = (root / 'BBE-LM-004-cert.txt').read_text(encoding='utf-8').strip()
else:
    cert = data.get('cert','')
for kind, txt in [('card', card), ('cert', cert)]:
    raw = base64.b64decode(txt, validate=True)
    if not (len(raw) > 20 and raw[:4] == b'RIFF' and raw[8:12] == b'WEBP'):
        raise SystemExit(f'{oid}: FAIL - {kind} is not valid WEBP')
print(f'{oid}: PASS')
