# Rund ums Haus – SEO + Google (versiune pregătită)

Site static, fără reclame/tracking, cu navigare laterală pe homepage și **4 pagini individuale** pentru serviciile oferite, accesibile prin linkuri HTML normale.

## Obligatoriu înainte de indexare
- Confirmați domeniul real (de exemplu, domeniul .de cumpărat efectiv), nu un exemplu.
- Adăugați localitatea bazei firmei și localitățile reale deservite. Nu inventați sau repetați artificial orașe.
- Completați pagina Impressum și politica Datenschutz după datele reale ale firmei și hostingului.
- Pentru compania locală, o schemă de tip LocalBusiness cu adresă și areaServed se poate finaliza DOAR după primirea datelor corecte. Site-ul include acum o schemă de tip Organization fără locație inventată.

## Configurare domeniu pentru sitemap / canonical
Când domeniul este activ și arată spre hosting, în rădăcina proiectului executați:

    python tools/seo_domain.py https://DOMENIUL-REAL.de

Asta generează `sitemap.xml`, actualizează `robots.txt` și completează canonical și Open Graph URL-urile pentru cele 5 pagini publice. Nu folosiți un domeniu de exemplu: Google are nevoie de URL-urile finale.

## Google Search Console (gratuit)
- https://search.google.com/search-console → Add Property → Domain → verificați domeniul prin înregistrarea DNS TXT afișată de Google la administratorul DNS.
- După verificare: **Sitemaps → sitemap.xml → Submit**.
- Folosiți URL Inspection pentru pagina principală și cele patru pagini de servicii; puteți solicita indexarea. Niciuna dintre aceste acțiuni nu garantează indexarea sau un anumit loc.

## Google Business Profile (gratuit)
- https://business.google.com/ → adăugați / revendicați firma reală și finalizați verificarea.
- Denumire REALĂ: `Rund ums Haus`; fără cuvinte-cheie artificiale adăugate numelui.
- Categoriile, programul și aria de servicii trebuie să fie corecte. Pentru firmele care merg la clienți și nu primesc clienți la adresă, adresa se ascunde în profilul public, potrivit regulilor Google.
- Adăugați poze REALE ale echipei/lucrărilor când există, descriere fidelă, servicii și solicitați recenzii autentice.

## GitHub & Vercel / Hostna
Toate fișierele sunt statice. `index.html`, paginile de servicii, CSS și `assets/` trebuie să fie în rădăcina site-ului. `tools/` este o unealtă locală pentru pregătire, nu necesită server Python.

Site-ul existent a fost păstrat vizual. Noile pagini SEO sunt legate din fiecare panou al serviciilor.
