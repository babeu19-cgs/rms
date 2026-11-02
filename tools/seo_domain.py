#!/usr/bin/env python3
"""Create canonical links, OG URLs, and sitemap.xml for the exact LIVE domain.
Run after the real domain is connected to the site. Usage:
    python tools/seo_domain.py https://your-real-domain.de
"""
from pathlib import Path
from urllib.parse import urlparse
from html import escape
import re, sys, json
if len(sys.argv) != 2:
    print("Usage: python tools/seo_domain.py https://DEINE-ECHTE-DOMAIN.de")
    sys.exit(1)
base = sys.argv[1].strip().rstrip('/')
u = urlparse(base)
if u.scheme != 'https' or not u.hostname or '.' not in u.hostname or u.path or u.query or u.fragment:
    raise SystemExit('Bitte die echte HTTPS-Adresse der Domain .de angeben, ohne Pfad.')
root=Path(__file__).resolve().parent.parent
names=['index.html','reinigung.html','gartenarbeit.html','entruempelung.html','fensterreinigung.html','steinreinigung.html','hausmeisterservice.html','umzug.html']
for file in names:
    path=root/file
    html=path.read_text(encoding='utf-8')
    public=base+'/' if file == 'index.html' else base+'/'+file
    html=re.sub(r'\n\s*<link rel="canonical"[^>]*>', '', html)
    html=re.sub(r'\n\s*<meta property="og:url"[^>]*>', '', html)
    head=f'\n  <link rel="canonical" href="{escape(public,quote=True)}">\n  <meta property="og:url" content="{escape(public,quote=True)}">'
    html=html.replace('</head>',head+'\n</head>',1)
    path.write_text(html,encoding='utf-8')
entries='\n'.join('  <url><loc>'+escape(base+('/' if file=='index.html' else '/'+file))+'</loc></url>' for file in names)
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries+'\n</urlset>\n',encoding='utf-8')
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n',encoding='utf-8')
print('Configurat pentru '+base+'; sitemap.xml generat. Upload / commit în GitHub după verificare.')
