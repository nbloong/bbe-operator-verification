import base64, json, pathlib, string
p = pathlib.Path('assets/docs/BBE-LM-006.json')
data = json.loads(p.read_text(encoding='utf-8'))
cert = data.get('cert','')
allowed = set(string.ascii_letters + string.digits + '+/=')
bad = [(i, repr(ch)) for i,ch in enumerate(cert) if ch not in allowed]
print('cert length:', len(cert))
print('invalid chars:', len(bad), bad[:20])
clean = ''.join(ch for ch in cert if ch in allowed)
clean += '=' * ((4 - len(clean) % 4) % 4)
try:
    raw = base64.b64decode(clean, validate=True)
    print('clean length:', len(clean), 'decoded:', len(raw), 'head:', raw[:12])
    ok = len(raw) > 20 and raw[:4] == b'RIFF' and raw[8:12] == b'WEBP'
    print('cleaned WEBP:', ok)
except Exception as e:
    print('decode error:', type(e).__name__, e)
    raise SystemExit(2)
if not ok:
    raise SystemExit(3)
data['cert'] = clean
p.write_text(json.dumps(data, separators=(',',':')), encoding='utf-8')
print('REPAIRED_JSON_WRITTEN')
