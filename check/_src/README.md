# Mitarbeiter-Check (deine-sparflamme.de/check/)

- Daten: `check/_src/mitarbeiter.json` (slug, vorname, nachname, nummer, email, position, region, aktiv)
- Bauen: `node check/_src/build.js` im Repo-Root, danach committen und pushen
- Foto: `check/<slug>/foto.jpg` ablegen (quadratisch, ca. 600×600 px). Fehlt es, zeigt die Seite Initialen.
- Mitarbeiter ausscheiden: `"aktiv": false` setzen und neu bauen, die Seite wird entfernt.
- Der Ordner `_src` wird von GitHub Pages (Jekyll) nicht veröffentlicht.
