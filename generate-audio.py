"""Build-time offline Japanese WAV generation. Run prepare-audio.cjs first."""
import hashlib
import json
from pathlib import Path
import sys
import wave
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / '.tools' / 'python'))
import numpy as np
import pyopenjtalk
output = ROOT / 'audio'
rows = json.loads((output / 'texts.json').read_text(encoding='utf-8'))
manifest = {'voice': 'Open JTalk mei_normal', 'generator': 'pyopenjtalk-plus', 'offline': True, 'items': []}
for row in rows:
    target = output / (row['id'] + '.wav')
    samples, sr = pyopenjtalk.tts(row['text'])
    pcm = np.clip(samples, -32768, 32767).astype('<i2')
    if not np.isfinite(samples).all() or np.max(np.abs(samples)) < 10:
        raise RuntimeError('Silent or invalid speech: ' + row['id'])
    with wave.open(str(target), 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(int(sr))
        wav.writeframes(pcm.tobytes())
    manifest['items'].append({'id': row['id'], 'bytes': target.stat().st_size, 'seconds': len(samples)/sr, 'peak': float(np.max(np.abs(samples))), 'rms': float(np.sqrt(np.mean(samples**2))), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
    print(row['id'], round(len(samples)/sr, 2), 'seconds', flush=True)
(output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
