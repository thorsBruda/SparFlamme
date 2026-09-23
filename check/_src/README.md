# Mitarbeiter-Check (deine-sparflamme.de/check/)

- Daten: `check/_src/mitarbeiter.json` (slug, vorname, nachname, nummer, email, telefon, position, region, aktiv); `telefon` = Arbeitsnummer aus der App, leer = Zeile entfällt
- Nummer = Mitarbeiternummer aus der App (Benutzerverwaltung, 5-stellig, wird dort automatisch vergeben)
- Bauen: `node check/_src/build.js` im Repo-Root, danach committen und pushen
- Foto: kommt live aus der App (Benutzerverwaltung → Bearbeiten → Ausweisfoto), URL `https://app.d-sf.de/api/check/<nummer>/foto.jpg`. Fallback: `check/<slug>/foto.jpg` im Repo, sonst Initialen.
- Mitarbeiter ausscheiden: `"aktiv": false` setzen und neu bauen, die Seite wird entfernt.
- Der Ordner `_src` wird von GitHub Pages (Jekyll) nicht veröffentlicht.
