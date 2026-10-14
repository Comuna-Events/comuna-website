#!/usr/bin/env python3
"""Build the site: wraps each page in src/pages/ with src/layout.html.

Run `python3 build.py` after editing anything in src/. It writes the finished
pages (index.html, about.html, ...) to the repo root, which GitHub Pages serves.
"""
import pathlib, re

ROOT = pathlib.Path(__file__).parent
SITE = {
    'site_url': 'https://www.wearecomuna.com',
    # The interactive app demo. Change this if the app moves.
    'demo_url': 'https://mitchellkimball.github.io/third-space-app/',
}
NAV = ['home', 'passport', 'hosts', 'about']

layout = (ROOT / 'src/layout.html').read_text()
for src in sorted((ROOT / 'src/pages').glob('*.html')):
    text = src.read_text()
    meta = dict(re.findall(r'^\s*(\w+):\s*(.+?)\s*$', text.split('-->', 1)[0], re.M))
    body = text.split('-->', 1)[1].strip()
    out_name = src.name
    path = '/' if out_name == 'index.html' else '/' + out_name[:-5]
    values = {**SITE, 'topbar': '', **meta, 'path': path, 'root': './', 'content': body}
    for n in NAV:
        values['cur_' + n] = 'aria-current="page"' if meta.get('nav') == n else ''
    html = layout
    for _ in range(2):  # page content may itself use {{root}} / {{demo_url}}
        html = re.sub(r'\{\{(\w+)\}\}', lambda m: values.get(m.group(1), m.group(0)), html)
    left = re.findall(r'\{\{\w+\}\}', html)
    if left:
        raise SystemExit(f'{src.name}: unfilled {sorted(set(left))}')
    (ROOT / out_name).write_text(html)
    print('built', out_name)
