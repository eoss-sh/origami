# PRD – Origami (Kita-App)

**Version:** 0.1 (Prototyp) · **Datum:** 03.07.2026 · **Autor:** Simon Herensperger / erstellt mit Claude
**Status:** Entwurf – Grundlage für klickbaren Prototyp & erste Code-Iteration

---

## 1. Zweck & Kontext

Origami ist eine Tablet-first App für Kita-Betreuungspersonen. Sie digitalisiert die täglichen Kernabläufe einer Gruppe: Anwesenheit (Check-in/Check-out), sichere Abholung über einen kindgerechten Abholcode, Kommunikation mit Eltern sowie sicherheitskritische Alltagsinformationen (Allergien).

Dieses PRD beschreibt den Umfang des **Prototyps**, der zwei Zwecke erfüllt:

1. Durchführung moderierter Usability-Tests entlang dreier definierter Test-Aufgaben (siehe Kap. 10)
2. Technisches Fundament, auf dem nach den Tests weiterentwickelt werden kann (kein Wegwerf-Prototyp)

Die UX-Grundlagen (Szenarien nach Collaborative UX Design, Wireframe, Design-Richtung) liegen vor; das Figma-File «Origami-Design» enthält Assets (20 Origami-Icons, 3 Logo-Konzepte) und den ersten Screen «Home – Gruppenliste (iPad)».

## 2. Problem

Betreuungspersonen haben während der Betreuungszeit kaum freie Hände und maximal 1–2 Minuten am Stück für ein Gerät. Kritische Abläufe sind heute fehleranfällig oder unangenehm:

- **Abholung:** Bei unbekannten Abholpersonen muss die Betreuungsperson auf ihr Personengedächtnis oder Papierlisten vertrauen. Die soziale Situation («Darf ich das Kind dieser Person mitgeben?») ist belastend.
- **Krankmeldung:** Eltern telefonisch zu erreichen erfordert, die Gruppe zu verlassen und Kontaktdaten zu suchen.
- **Allergien:** Ausgedruckte Listen am Anschlagbrett sind bei wechselnden Gruppenzusammensetzungen (Besuchskinder) oft nicht aktuell – ausgerechnet dort, wo das Risiko am grössten ist.

## 3. Personas

**Primär – Lena Suter**, 27, Fachfrau Betreuung EFZ, Gruppe «Igel» (11 Kinder). Nutzt ein Kita-Tablet/Smartphone. Jede Interaktion muss unterbrechbar sein und in unter 2 Minuten abgeschlossen werden können. Kennt noch nicht alle Eltern vom Sehen (2 Monate im Betrieb).

**Sekundär – Eltern** (z.B. Bens Mutter). Empfangen Benachrichtigungen und Abholanfragen, bestätigen per Chat. Im Prototyp nur als Gegenstelle simuliert (kein eigenes Eltern-Frontend im Scope).

## 4. Kernkonzept: Der Abholcode

Jedes Kind hat eine **persönliche Origami-Figur** (z.B. Fuchs, Boot, Schmetterling – aus dem Icon-Set). Beim morgendlichen Check-in generiert die App eine **zufällige Tagesfarbe**. Die Kombination **Figur + Tagesfarbe** (z.B. «blauer Fuchs») ist der Abholcode des Tages.

Regeln:

- Der Code wird beim Check-in erzeugt und den Erziehungsberechtigten automatisch mitgeteilt (Chat/Push).
- Wer den Code kennt, gilt als von den Eltern autorisiert – unabhängig davon, ob die Betreuungsperson die Person kennt.
- Der Code ist pro Kind und Tag gültig und wird beim Checkout verifiziert und protokolliert.
- Die Figur ist zugleich der Avatar des Kindes in der App (visuelle Klammer zum Namen «Origami»).

## 5. Scope

### In Scope (Prototyp)

| # | Feature | Test-Aufgabe |
|---|---------|--------------|
| F1 | Gruppenliste (Home, iPad) mit Anwesenheitsstatus, Suche, Filtern | Basis für alle |
| F2 | Check-in mit Code-Generierung (Figur + Tagesfarbe) | Vorbedingung |
| F3 | Krankmeldung erfassen & Abholanfrage an Eltern auslösen | Aufgabe «krankes Kind» |
| F4 | Eltern-Chat (WhatsApp-integriert, im Prototyp gemockt) | Aufgabe «krankes Kind» |
| F5 | Checkout mit Code-Verifikation und Erfassung der Abholperson | Aufgabe 3 |
| F6 | Allergie-Filter in der Gruppenliste | Aufgabe «Essensausgabe» |
| F7 | Tagesjournal pro Kind (automatische Protokollierung von Vorfällen, Check-in/out) | implizit |

### Out of Scope (Prototyp)

- Eltern-App / Eltern-Frontend (Elternreaktionen werden im Test moderiert simuliert)
- Echte WhatsApp-Business-API-Anbindung (Mock; siehe offene Frage O5)
- Administration: Kinder/Gruppen/Kontakte anlegen (Seed-Daten)
- Abrechnung, Essensbestellung, Dienstplanung, Foto-Sharing
- Mehrsprachigkeit (Prototyp: Deutsch)
- Authentifizierung/Rollenkonzept über einen simplen Login hinaus

## 6. Informationsarchitektur

```
Home (Gruppenliste)
├── Kind-Detail
│   ├── Tagesjournal
│   ├── Krankmeldung erfassen → Abholanfrage
│   └── Chat mit Eltern
├── Checkout-Dialog (Popup mit Abholcode)
└── Filter/Suche (Alle · Hier · Fehlt · Allergien)
```

Der Home-Screen ist der einzige Einstiegspunkt. Alles Kritische ist von dort in maximal zwei Taps erreichbar.

## 7. Funktionale Anforderungen

### F1 – Gruppenliste (Home)

Referenz: Wireframe + Figma-Screen «Home – Gruppenliste (iPad)».

- **F1.1** Die Liste zeigt die **tatsächliche Tagesbelegung** der Gruppe, inkl. Besuchskinder aus anderen Gruppen – nicht die Stammgruppe.
- **F1.2** Kopfbereich: Datum, Anwesenheits-Summary «X von Y da» mit Fortschrittsbalken.
- **F1.3** Pro Kind: Origami-Figur (Avatar), Name, Alter, Allergie-Badges, Check-in-Zeit (falls anwesend), Anwesenheits-Toggle.
- **F1.4** Suche nach Kindsname (Filter ab erstem Zeichen).
- **F1.5** Filter-Chips: **Alle** (Default) · **Hier** · **Fehlt** · **Allergien**. Genau ein Chip aktiv.
- **F1.6** Der Allergie-Filter reduziert die Liste auf Kinder mit hinterlegten Allergien/Unverträglichkeiten; Allergie-Badges bleiben auch ungefiltert in jeder Zeile sichtbar (Redundanz ist hier gewollt – Sicherheitsinformation).

*Akzeptanz:* Lena findet ein Kind in < 5 Sekunden; der Allergie-Filter zeigt bei Testdaten exakt die 3 Allergiekinder inkl. Besuchskind.

### F2 – Check-in & Code-Generierung

- **F2.1** Toggle in der Gruppenliste auf «anwesend» = Check-in mit Zeitstempel.
- **F2.2** Beim Check-in generiert das System die Tagesfarbe zufällig aus einer definierten Palette (kindertauglich benennbar: Blau, Rot, Grün, Gelb, Lila, Orange).
- **F2.3** Der Abholcode (Figur + Farbe) wird gespeichert und den hinterlegten Erziehungsberechtigten via Chat mitgeteilt («Bens Code heute: blauer Fuchs 🦊»).
- **F2.4** Der Code ist bis zum Checkout bzw. Tagesende gültig; ein erneuter Check-in am selben Tag erzeugt keinen neuen Code.
- **F2.5** Toggle auf «abwesend» bei einem eingecheckten Kind öffnet den Checkout-Dialog (F5) – kein stiller Status-Wechsel.

### F3 – Krankmeldung & Abholanfrage

Referenz: Szenario «Krankes Kind melden und Abholung organisieren».

- **F3.1** Vom Kind-Detail aus: «Krankmeldung» mit Minimal-Erfassung: Symptom (Auswahl: Fieber, Erbrechen, Durchfall, Ausschlag, Sonstiges), optional Temperatur, optional Freitext. Erfassung in < 30 Sekunden möglich.
- **F3.2** Aktion «Abholung anfragen»: Das System benachrichtigt **alle heute abholberechtigten, priorisierten Kontakte** automatisch – Lena wählt niemanden aus und schlägt nichts nach.
- **F3.3** Die Antwort der Eltern (Bestätigung + voraussichtliche Ankunftszeit) erscheint als Status am Kind: «Abholung angefragt» → «Mutter unterwegs, ca. 14:45».
- **F3.4** Krankmeldung und Abholanfrage werden automatisch im Tagesjournal dokumentiert.
- **F3.5** Der Status ist in der Gruppenliste sichtbar (Badge/Indikator an der Zeile), damit auch Kolleg:innen bei Schichtübergabe informiert sind.

*Akzeptanz:* Der komplette Ablauf (Kind finden → Krankmeldung → Anfrage → Bestätigung sichtbar) ist in < 2 Minuten und ohne Verlassen der App abschliessbar.

### F4 – Eltern-Chat

- **F4.1** Pro Kind ein Chat-Thread mit den Erziehungsberechtigten; Transportkanal WhatsApp (im Prototyp: Mock-Adapter, der eingehende Elternnachrichten über ein verstecktes Testpanel simulierbar macht).
- **F4.2** Systemnachrichten (Abholcode, Abholanfrage) erscheinen im selben Thread, visuell als System-Events unterscheidbar.
- **F4.3** Freitextnachrichten in beide Richtungen.
- **F4.4** Ungelesene Nachrichten werden am Kind in der Gruppenliste angezeigt.

### F5 – Checkout mit Code-Verifikation

Referenz: Szenario «Abholung verifizieren und Kind auschecken».

- **F5.1** Checkout wird vom Kind aus gestartet (Toggle oder Kind-Detail). Es öffnet sich ein Popup.
- **F5.2** Das Popup zeigt den Code **erst nach bewusster Interaktion** («Code anzeigen»), davor die Aufforderung: «Frage zuerst nach dem Codewort.» (Design-Hypothese: verhindert Vorlesen statt Abfragen – im Usability-Test gezielt beobachten.)
- **F5.3** Verifikation: Betreuungsperson bestätigt «Code korrekt» oder wählt «Code falsch/unbekannt».
- **F5.4** Bei korrektem Code: Erfassung der Abholperson – **Mutter · Vater · Andere** (bei «Andere»: Namensfeld, Pflichtangabe).
- **F5.5** Abschluss: Kind wird ausgecheckt; protokolliert werden Zeitstempel, Abholperson, Code-Verifikation. Offene Vorfälle (z.B. Krankmeldung) werden im Journal als abgeschlossen markiert.
- **F5.6** Negativ-Pfad bei falschem Code: Checkout wird **nicht** durchgeführt; die App bietet an, die Eltern im Chat zu kontaktieren, und protokolliert den Fehlversuch. (Policy-Details siehe O2/O3 – für den Prototyp reicht dieser Minimal-Pfad.)

*Akzeptanz:* Happy Path in < 1 Minute; ein Checkout ohne Code-Verifikations-Schritt ist technisch nicht möglich.

### F6 – Allergie-Kontrolle (Essensausgabe)

Referenz: Szenario «Essensausgabe mit Allergie-Kontrolle». Funktional durch F1.5/F1.6 abgedeckt; zusätzlich:

- **F6.1** Im gefilterten Zustand zeigt jede Zeile die konkreten Allergien prominent (nicht nur ein generisches Badge).
- **F6.2** Optional, hinter Feature-Flag (siehe O4): Quittierung «Menü verteilt» pro Allergiekind mit Zeitstempel im Journal.

### F7 – Tagesjournal

- **F7.1** Chronologisches Protokoll pro Kind und Tag: Check-in (inkl. Code), Krankmeldungen, Abholanfragen, Chat-Systemereignisse, Checkout (inkl. Abholperson und Verifikation).
- **F7.2** Einträge entstehen automatisch als Nebeneffekt der Abläufe – kein manueller Dokumentationsaufwand.
- **F7.3** Lesbar im Kind-Detail; Ziel: Nachvollziehbarkeit für Schichtübergabe und Kita-Leitung.

## 8. Datenmodell (Entwurf)

```
Group        (id, name)
Child        (id, group_id, first_name, last_name, birthdate, figure)     // figure = Origami-Icon-Key
Allergy      (id, child_id, label, severity?)
Guardian     (id, name, phone, relation)                                   // Mutter, Vater, Grosi, ...
Authorization(id, child_id, guardian_id, pickup_allowed, priority, valid_on?)
Attendance   (id, child_id, date, checkin_at, checkout_at?,
              code_color, code_verified?, picked_up_by_type, picked_up_by_name?)
Incident     (id, child_id, type[sick|pickup_request|...], symptom?, temperature?,
              note?, status[open|confirmed|closed], created_at, closed_at?)
Message      (id, child_id, direction[in|out|system], body, created_at, read_at?)
JournalEntry (id, child_id, date, kind, payload_json, created_at)          // oder als View über obige Tabellen
```

Hinweis: `JournalEntry` kann im Prototyp als abgeleitete Sicht (View) über Attendance/Incident/Message umgesetzt werden statt als eigene Tabelle – weniger Redundanz.

## 9. Nicht-funktionale Anforderungen

- **NFR1 – Interaktionsbudget:** Jeder Kernablauf ist unterbrechbar und in ≤ 2 Minuten abschliessbar; kritische Information (Allergien, Abholstatus) ist ohne Navigation sichtbar.
- **NFR2 – Gerät:** iPad-first (834×1194 als Referenz), responsive bis Smartphone. Touch-Ziele ≥ 44 pt.
- **NFR3 – Datenschutz:** Kinderdaten plus Gesundheitsdaten (Allergien, Krankmeldungen) sind besonders schützenswerte Personendaten (revDSG/DSGVO). Hosting Schweiz/EU. Für den Prototyp: ausschliesslich fiktive Seed-Daten, niemals echte Kinderdaten in Tests.
- **NFR4 – Nachvollziehbarkeit:** Alle abhol- und gesundheitsrelevanten Aktionen sind mit Zeitstempel und handelnder Person protokolliert und nicht nachträglich editierbar (append-only Journal).
- **NFR5 – Robustheit:** Kurze Verbindungsabbrüche dürfen keinen Datenverlust bei laufender Erfassung verursachen (lokaler Zwischenstand). Volle Offline-Fähigkeit ist nicht gefordert.

## 10. Mapping auf die Usability-Test-Aufgaben

| Test-Aufgabe | Ablauf im Prototyp | Beobachtungsfokus |
|---|---|---|
| Ben wird krank → Eltern kontaktieren | Home → Ben → Krankmeldung → Abholung anfragen → Bestätigung sichtbar | Findet die Testperson Ben ohne Elternnamen? Wird die Bestätigung (Schritt 5) wahrgenommen? |
| Eltern treffen ein → Ben auschecken | Ben → Checkout-Popup → Code abfragen → «Code anzeigen» → korrekt → Abholperson «Mutter» → Checkout | **Fragt** die Testperson den Code ab oder **liest sie ihn vor**? (F5.2-Hypothese) |
| Essensausgabe → Allergien prüfen | Home → Filter «Allergien» → Abgleich mit Menüs | Wird der Filter gefunden, oder öffnet die Testperson einzelne Profile? |

Seed-Daten müssen so gestaltet sein, dass ein Besuchskind mit Allergie enthalten ist (Härtefall aus dem Szenario).

## 11. Design-Referenzen

- Figma: **Origami-Design** → Seite «📱 Screens» (Home-Screen) und «🧩 Assets» (20 Icons, 3 Logos)
- Stilrichtung: warm & verspielt (Referenz Koala-App): Creme `#FBF2E6`, Gelb `#F9B233`, Navy `#14243A`, Grau `#8A8F98`, Grün `#3FA46A`; Typo **Nunito**; Karten mit Radius 20 und weichem Schatten; organische Wellenformen als Deko
- Origami-Icons als `currentColor`-SVGs vorhanden (Kinder-Avatare = Abholcode-Figuren)

## 12. Tech-Empfehlung (nicht bindend)

Passend zum bestehenden Setup: **Next.js + Supabase** (Postgres, Auth, Realtime für Chat-/Status-Updates), Tailwind, Seed-Skript für Testdaten. WhatsApp als austauschbarer `MessagingAdapter` (Interface) mit Mock-Implementierung; Testpanel zum Simulieren von Elternantworten während der Usability-Tests. Agentic Setup mit CLAUDE.md, Vitest und Supabase-CLI-Schema-Workflow analog zum Interview-Analyse-Tool.

## 13. Offene Fragen & Entscheidungen

| # | Frage | Empfehlung / Stand |
|---|---|---|
| O1 | Code-Aufdeck-Interaktion (F5.2): reicht der Hinweis, oder braucht es härtere Guardrails? | Im Usability-Test beobachten, dann entscheiden |
| O2 | Mismatch: Mutter hat sich angekündigt, jemand anderes kommt mit korrektem Code – warnen oder nicht? | Policy-Frage; mit Kita-Leitungen validieren, nicht im Design entscheiden |
| O3 | Eskalationspfad bei falschem Code (Leitung informieren? Nach X Versuchen sperren?) | Für Prototyp: Minimal-Pfad F5.6; produktiv definieren |
| O4 | Quittierung Essensausgabe (F6.2): Dokumentationspflicht vs. Alltagstauglichkeit (1 Tap/Kind) | Feature-Flag; Frage für Interviews mit Kita-Leitungen |
| O5 | WhatsApp als Kanal: datenschutzrechtlich heikel für Gesundheitsdaten von Kindern (Meta-Verarbeitung, AVV). | **Risiko.** Prototyp: Mock. Produktiv prüfen: WhatsApp Business API mit AVV vs. eigener In-App-Kanal mit Push; ggf. WhatsApp nur für neutrale Trigger («Sie haben eine Nachricht»), Inhalte in der App |
| O6 | Farbpalette Abholcode: Verwechslungssicherheit (Farbfehlsichtigkeit bei Abholpersonen) | Farben immer mit Wort kommunizieren («blauer Fuchs»), nie nur visuell |
| O7 | Was passiert mit dem Code bei Geschwistern / Mittagskindern mit zwei Check-ins? | F2.4 als Default; Randfälle nach Tests schärfen |