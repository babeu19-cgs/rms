# Rund ums Haus — Website cu navigare laterală

Website static în limba germană, cu **scroll orizontal**, swipe pe telefon, animații la tranziție, navigație prin săgeți și butoane interactive. Imagini locale WebP, logo, date de contact și formular `mailto:`. Nu necesită React, npm sau build.

## Publicare GitHub + Vercel

1. Extrage ZIP-ul; încarcă **fișierele direct în rădăcina repository-ului** GitHub (nu încărca fișierul ZIP ca atare). `index.html` trebuie să fie direct în repository, alături de `styles.css`, `script.js`, `vercel.json` și folderul `assets`.
2. Dacă ai deja repository-ul `rund-ums-haus`, **înlocuiește fișierele vechi cu cele noi** (ideal printr-un commit Git). Dacă vrei o versiune separată, creează un repository nou.
3. Vercel: importă repository-ul prin **Add New > Project** dacă nu este conectat deja. Framework **Other**, Root Directory `./`, Build Command gol și Output Directory implicit. Dacă proiectul Vercel există deja și e conectat la repository, simplul commit/push pe ramura `main` pornește în mod normal deploy-ul automat.
4. Site-ul nu cere variabile de mediu sau server backend.

## Interacțiuni

- Desktop: rotița mouse-ului înainte/înapoi = panouri laterale, iar trackpad-ul poate derula orizontal nativ; săgețile de jos, punctele, meniul și tastele ← → schimbă panourile.
- Mobil: swipe orizontal = secțiunea următoare/precedentă; swipe vertical = conținutul mai lung al panoului, inclusiv formularul.
- Preferința sistemului *Reduce Motion* dezactivează animațiile decorative.
- Formularul pregătește un e-mail în aplicația utilizatorului, **NU îl expediază automat**. Există buton de copiere a textului când e-mailul nu se deschide.

## Conținut și identificare

Nume: **Rund ums Haus** (nu `UMS Rund ums Haus`).

- Fix: 09402 9880947
- Mobil: 01786 672 158
- Email: info.ums.haus@web.de
- Servicii: Reinigung, Gartenarbeit, Entrümpelung, Umzug

Fotografiile sunt imagini ilustrative generate, nu imagini ale echipei / lucrărilor reale.

## Obligatoriu înainte de lansare

Pagini `impressum.html` și `datenschutz.html` conțin **câmpuri încă necompletate**. Cere titularul juridic, adresa sediului, eventualele înregistrări, și actualizează politica de confidențialitate pentru serviciul real de hosting (ex. Vercel). Verifică datele și textele cu proprietarul firmei. Publicarea unui site comercial cu informații legale incomplete poate crea probleme.
