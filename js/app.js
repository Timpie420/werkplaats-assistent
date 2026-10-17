// app.js - Main application logic

import { getAll, put, deleteRecord, STORES } from './db.js';

const content = document.getElementById('content');
const navButtons = document.querySelectorAll('#bottom-nav button');

let currentPage = 'start';

function setActiveNav(page) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}

function showPage(page) {
  currentPage = page;
  setActiveNav(page);
  switch (page) {
    case 'start': renderStart(); break;
    case 'onderdelen': renderOnderdelen(); break;
    case 'gereedschap': renderGereedschap(); break;
    case 'projecten': renderProjecten(); break;
    case 'meer': renderMeer(); break;
    default: content.innerHTML = '<p>Pagina niet gevonden</p>';
  }
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Start page
async function renderStart() {
  const onderdelen = await getAll(STORES.onderdelen);
  const gereedschap = await getAll(STORES.gereedschap);
  const projecten = await getAll(STORES.projecten);
  const notities = await getAll(STORES.notities);

  content.innerHTML = `
    <div class="card">
      <h2>Overzicht</h2>
      <p>Onderdelen: ${onderdelen.length}</p>
      <p>Gereedschap: ${gereedschap.length}</p>
      <p>Actieve projecten: ${projecten.filter(p => p.status !== 'Voltooid' && p.status !== 'Geannuleerd').length}</p>
      <p>Werknotities: ${notities.length}</p>
    </div>
    <div class="card">
      <h3>Snelle acties</h3>
      <button class="btn" onclick="window.quickNew('onderdeel')">Nieuw onderdeel</button>
      <button class="btn" onclick="window.quickNew('gereedschap')">Nieuw gereedschap</button>
      <button class="btn" onclick="window.quickNew('project')">Nieuw project</button>
      <button class="btn" onclick="window.quickNew('notitie')">Nieuwe werknotitie</button>
    </div>
    <div class="search-bar">
      <input type="search" id="global-search" placeholder="Zoek overal...">
    </div>
  `;

  document.getElementById('global-search')?.addEventListener('input', (e) => {
    // Simple search placeholder
    console.log('Search:', e.target.value);
  });
}

window.quickNew = (type) => {
  if (type === 'onderdeel') showPage('onderdelen');
  // etc, expand later
};

// Onderdelen
async function renderOnderdelen() {
  const items = await getAll(STORES.onderdelen);
  let html = `
    <h2>Onderdelen</h2>
    <button class="btn" id="new-onderdeel">Nieuw onderdeel</button>
    <div class="search-bar"><input type="search" id="search-onderdelen" placeholder="Zoek onderdelen..."></div>
  `;
  if (items.length === 0) {
    html += '<div class="empty-state">Er zijn nog geen onderdelen geregistreerd.</div>';
  } else {
    html += '<div class="card">';
    items.forEach(item => {
      html += `<div class="list-item" data-id="${item.id}">${item.naam || 'Naamloos'} <small>(${item.hoeveelheid || 0})</small></div>`;
    });
    html += '</div>';
  }
  content.innerHTML = html;

  document.getElementById('new-onderdeel')?.addEventListener('click', () => showForm('onderdeel'));
  document.querySelectorAll('.list-item').forEach(el => {
    el.addEventListener('click', () => showDetail('onderdeel', el.dataset.id));
  });
}

function showForm(type, id = null) {
  // Simplified form for parts
  content.innerHTML = `
    <h2>${id ? 'Bewerk' : 'Nieuw'} onderdeel</h2>
    <form id="part-form">
      <label>Naam *</label>
      <input type="text" name="naam" required>
      <label>Categorie</label>
      <select name="categorie">
        <option>Electronics</option>
        <option>Steel</option>
        <option>Aluminium</option>
        <option>Other</option>
      </select>
      <label>Hoeveelheid</label>
      <input type="number" name="hoeveelheid" min="0" value="1">
      <label>Notities</label>
      <textarea name="notities"></textarea>
      <button type="submit" class="btn">Opslaan</button>
      <button type="button" class="btn btn-secondary" id="cancel">Annuleren</button>
    </form>
  `;
  document.getElementById('part-form').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      id: id || crypto.randomUUID(),
      naam: fd.get('naam'),
      categorie: fd.get('categorie'),
      hoeveelheid: Number(fd.get('hoeveelheid')),
      notities: fd.get('notities'),
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    await put(STORES.onderdelen, data);
    showPage('onderdelen');
  };
  document.getElementById('cancel').onclick = () => showPage('onderdelen');
}

function showDetail(type, id) {
  // Placeholder detail
  content.innerHTML = `<h2>Detail</h2><p>ID: ${id}</p><button class="btn" onclick="showPage('onderdelen')">Terug</button>`;
}

// Placeholder for other pages
function renderGereedschap() {
  content.innerHTML = '<h2>Gereedschap</h2><div class="empty-state">Module in ontwikkeling</div>';
}
function renderProjecten() {
  content.innerHTML = '<h2>Projecten</h2><div class="empty-state">Module in ontwikkeling</div>';
}
function renderMeer() {
  content.innerHTML = `
    <h2>Meer</h2>
    <div class="card"><button class="btn" onclick="alert('Rekenmachine - binnenkort')">Technische rekenmachine</button></div>
    <div class="card"><button class="btn" onclick="alert('Lasdagboek')">Lasdagboek</button></div>
    <div class="card"><button class="btn" onclick="alert('Bibliotheek')">Technische bibliotheek</button></div>
    <div class="card"><button class="btn" onclick="alert('Notities')">Werknotities</button></div>
    <div class="card"><button class="btn" onclick="alert('Backup')">Back-up en herstel</button></div>
    <div class="card"><button class="btn" onclick="alert('Instellingen')">Instellingen</button></div>
  `;
}

// Init
showPage('start');

// PWA registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}