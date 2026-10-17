# Werkplaats Assistent

Lokale Progressive Web App voor workshop management.

## Status

Dit is een functionele foundation build met:

- Nederlandse interface
- Mobile-first design (donkere workshop-stijl)
- IndexedDB voor lokale opslag
- Navigatie tussen modules
- Onderdelen inventaris (basis create/list)
- PWA manifest en service worker
- Geen accounts, geen cloud, geen AI

## Beperkingen

Vanwege omgevingsbeperkingen (npm install issues) is dit een vanilla JavaScript implementatie in plaats van React/Vite.

Niet alle modules zijn volledig geïmplementeerd. De architectuur is klaar voor uitbreiding.

## Gebruik

1. Open `index.html` in een moderne browser (Chrome aanbevolen op Android).
2. Of host de map statisch (bijv. via GitHub Pages, Netlify free tier, of lokale server).
3. Installeer als PWA via browser menu ("Toevoegen aan startscherm").

## Backup

Gebruik de browser developer tools of implementeer export later. Data blijft lokaal in IndexedDB.

## Waarschuwing

Browser opslag kan verloren gaan als je browser data wist. Maak regelmatig backups.
