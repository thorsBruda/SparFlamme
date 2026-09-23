#!/usr/bin/env node
// Erzeugt die Mitarbeiter-Check-Seiten: check/<slug>/index.html + check/index.html
// Aufruf: node check/_src/build.js   (aus dem Repo-Root)
// Daten:  check/_src/mitarbeiter.json   Foto: check/<slug>/foto.jpg (quadratisch, ~600px)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mitarbeiter.json'), 'utf8'));
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const idx = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stand = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

const aktive = data.filter(m => m.aktiv !== false);
for (const m of aktive) {
    if (!/^[a-z0-9-]+$/.test(m.slug)) throw new Error('Ungültiger Slug: ' + m.slug);
    // Arbeitstelefon: Anzeige 0155 1028 9853, Link tel:+49...
    const telRoh = String(m.telefon || '').replace(/[^\d+]/g, '');
    const telLink = telRoh ? (telRoh.startsWith('+') ? telRoh : '+49' + telRoh.replace(/^0/, '')) : '';
    const telAnzeige = telRoh ? telRoh.replace(/^(\+49|0)/, '0').replace(/^(0\d{3})(\d+)$/, '$1 $2') : '';
    const telefonRow = telRoh
        ? `                        <div><dt>Telefon</dt><span class="dots"></span><dd><a href="tel:${esc(telLink)}">${esc(telAnzeige)}</a></dd></div>\n`
        : '';
    const vars = {
        TELEFON_ROW: telefonRow,
        SLUG: m.slug, VORNAME: esc(m.vorname), NACHNAME: esc(m.nachname), NUMMER: esc(m.nummer),
        EMAIL: esc(m.email), POSITION: esc(m.position), REGION: esc(m.region || 'Nürnberg'),
        INITIALEN: esc((m.vorname[0] || '') + (m.nachname[0] || '')), STAND: stand,
    };
    const html = tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => { if (!(k in vars)) throw new Error('Platzhalter fehlt: ' + k); return vars[k]; });
    const dir = path.join(root, m.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log('✓ check/' + m.slug + '/  ' + m.nummer + '  ' + m.vorname + ' ' + m.nachname + (fs.existsSync(path.join(dir, 'foto.jpg')) ? '' : '  (kein foto.jpg, Initialen)') + (telRoh ? '' : '  (kein Telefon)'));
}

// Inaktive: Seite entfernen, damit der Link ins Leere läuft
const alleSlugs = new Set(aktive.map(m => m.slug));
for (const m of data.filter(m => m.aktiv === false)) {
    const p = path.join(root, m.slug, 'index.html');
    if (!alleSlugs.has(m.slug) && fs.existsSync(p)) { fs.unlinkSync(p); console.log('✗ check/' + m.slug + '/ entfernt (inaktiv)'); }
}

const publicList = aktive.map(m => ({ slug: m.slug, vorname: m.vorname, nachname: m.nachname, nummer: m.nummer, email: m.email }));
fs.writeFileSync(path.join(root, 'index.html'), idx.replace('{{MITARBEITER_JSON}}', JSON.stringify(publicList)));
console.log('✓ check/index.html (Suche)');
