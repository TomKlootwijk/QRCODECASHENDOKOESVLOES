"""Rebuild the single-file browser demo from its local sources. No dependencies."""
from pathlib import Path
root = Path(__file__).resolve().parent
html = (root / 'template.html').read_text(encoding='utf-8')
for token, filename in [('/*__CORE__*/', 'organism_core.js'), ('/*__UI__*/', 'ui.js')]:
    source = (root / filename).read_text(encoding='utf-8')
    if '</script' in source.lower():
        raise ValueError(f'{filename} contains an HTML script closing sequence')
    if html.count(token) != 1:
        raise ValueError(f'Expected exactly one {token} placeholder')
    html = html.replace(token, source)
(root / 'XD_TAU_Starry_Organisms.html').write_text(html, encoding='utf-8')
print('Built XD_TAU_Starry_Organisms.html')
