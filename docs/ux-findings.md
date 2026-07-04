# UX-Findings – Origami Kita-App
## Erkenntnisse aus iterativem Prototyping & User Testing

---

## 1. Checkout-Flow: Weniger Klicks, mehr Effizienz

### Problem
Der ursprüngliche Checkout hatte 5 Schritte: Code verdecken → "Code anzeigen" klicken → Code prüfen → Abholperson wählen → Bestätigung.

### Iteration
| Version | Schritte | Erkenntnis |
|---------|----------|------------|
| V1 | 5 Schritte (Code verdeckt → anzeigen → prüfen → Abholer → Bestätigung) | Zu viele Klicks, der verdeckte Code bringt keinen Mehrwert |
| V2 | 3 Schritte (Code sichtbar → prüfen → Abholer → Bestätigung) | Bestätigung unnötig, User wollen sofort weiter |
| V3 (final) | 1 Screen (Code + Verifikation + Abholer kombiniert) | Alles auf einen Blick, ein Klick zum Auschecken |

### Finding
> **Die Code-Verdeckung (PRD F5.2) hat sich im Test nicht bewährt.** User haben den Code trotzdem vorgelesen statt abgefragt. Die soziale Situation lässt sich nicht durch UI-Friction lösen. Der direkt sichtbare Code mit Ja/Nein-Buttons ist schneller und genauso sicher.

### Design-Hypothese bestätigt/widerlegt
- PRD O1 ("Code-Aufdeck-Interaktion: reicht der Hinweis?"): **Widerlegt** – selbst mit Guardrails wird vorgelesen. Empfehlung: Code direkt zeigen, dafür den Verifikations-Schritt beibehalten.

---

## 2. Toggle-Design: Aktion statt Status zeigen

### Problem
User verstanden nicht, was der Checkmark-Button (✓) bei anwesenden Kindern bedeutet. "Ist das Kind jetzt da, oder muss ich das noch bestätigen?"

### Iteration
| Version | Nicht da | Anwesend | Feedback |
|---------|----------|----------|----------|
| V1 | Leerer Kreis ○ | iOS-Toggle-Switch | "Langweilig", nicht tablet-nativ |
| V2 | Leerer Kreis ○ | Checkmark ✓ | Status unklar – "Was heisst der Haken?" |
| V3 | Pfeil rein → (Check-in) | Checkmark ✓ | Besser, aber Haken verwirrt noch |
| V4 (final) | Pfeil rein → "Check-in" | Pfeil raus ← "Check-out" | Klar – Button zeigt die **nächste Aktion** |

### Finding
> **Aktions-Labels sind verständlicher als Status-Icons.** User erwarten, dass ein Button zeigt was passiert wenn man klickt, nicht den aktuellen Zustand. "Check-in" / "Check-out" als Label unter den Icons eliminiert Unsicherheit.

---

## 3. Krankmeldung: Kontext-abhängiger Flow

### Problem
Beim Krank-Melden eines nicht-anwesenden Kindes (z.B. Anruf der Eltern) wurde trotzdem "Abholung anfragen" vorgeschlagen – obwohl das Kind gar nicht in der Kita war.

### Lösung
- **Kind anwesend** → Krankmeldung → Kontaktpersonen mit Anruf/Nachricht-Optionen
- **Kind abwesend** → Krankmeldung → direkt "Erfasst" (keine Abholung nötig)
- Krank-Button in der Liste als Toggle: einmal klicken = krank melden, nochmal = aufheben
- Kranke Kinder rutschen ans Ende der Liste (animiert)

### Finding
> **Der gleiche Feature braucht unterschiedliche Flows je nach Kontext.** Ein "one-size-fits-all" Dialog führt zu Verwirrung. Die App muss den Zustand des Kindes kennen und den Flow entsprechend anpassen.

---

## 4. Kontakt-Aktionen: Direkte Erreichbarkeit

### Problem
Kontaktpersonen waren nur als Text (Name + Telefonnummer) dargestellt. Im Ernstfall musste die Nummer kopiert und in der Telefon-App eingefügt werden.

### Lösung
Jede Kontaktperson hat zwei Action-Buttons:
- **Telefon** (grün) → Anruf starten
- **Nachricht** (blau) → In-App-Chat öffnen

Diese Icons erscheinen:
- Im Kindprofil (Detail-Panel + Detailseite)
- Im Krankmeldungs-Dialog (nach Erfassung: "Wen kontaktieren?")

### Finding
> **Kommunikationsaktionen müssen kontextgebunden und sofort verfügbar sein** – besonders in Stresssituationen (krankes Kind). Die Betreuerin soll nicht zwischen Apps wechseln müssen.

---

## 5. Split-View: Flexibel statt fix

### Problem
Auf Tablets wird der Bildschirmplatz durch ein Overlay-Drawer-Pattern (Smartphone-UX) verschwendet. Aber: nicht alle Betreuerinnen wollen eine fixe Zwei-Spalten-Ansicht.

### Iteration
| Version | Ansatz | Feedback |
|---------|--------|----------|
| V1 | Drawer von rechts (Overlay) | Funktioniert, aber viele Klicks |
| V2 | Festes Split-View ab 1024px | Gut, aber manche finden es zu eng |
| V3 (final) | **Pin-Toggle** – User entscheidet | Jeder kann nach Präferenz arbeiten |

### Placement des Pin-Buttons
| Position | Feedback |
|----------|----------|
| Bei den Filter-Chips | "Gehört da nicht hin" – falscher Kontext |
| Im Header der Namenskarte | "Wirkt verloren" – vermischt Layout-Control mit Inhalt |
| **Über der Karte als Toolbar** | "Logisch" – steuert das Panel, nicht den Inhalt |

### Finding
> **Layout-Controls gehören nicht in Content-Cards.** Ein Button der das Container-Verhalten steuert (pin/unpin) muss visuell ausserhalb des Inhalts stehen. Die Präferenz wird in localStorage gespeichert – die App merkt sich die Wahl.

---

## 6. Gruppierte Liste: Visuelle Orientierung

### Problem
Eine flache Liste von 11+ Kindern bietet keine schnelle Übersicht über den Tagesstatus.

### Lösung
Drei Sektionen mit dezenten Headers:
- **Anwesend** (grün) – eingecheckte Kinder
- **Abwesend** (grau) – nicht eingecheckte Kinder  
- **Krank** (rot) – krank gemeldete, nicht anwesende Kinder

### Animierter Gruppenwechsel
Beim Check-in gleitet die Karte animiert von "Abwesend" nach "Anwesend" (Spring-Animation, 600ms). Die Seite scrollt automatisch zur neuen Position.

### Finding
> **Gruppierung reduziert die kognitive Last erheblich.** Statt jede Zeile zu scannen, erfasst die Betreuerin den Tagesstatus in Sekunden. Die Animation macht den Wechsel nachvollziehbar – das Kind "verschwindet" nicht einfach.

---

## 7. Dashboard-Widgets: Morgenübersicht

### Drei kompakte Karten oben auf der Hauptseite:
| Widget | Inhalt | Aktion |
|--------|--------|--------|
| **Nachrichten** (blau) | Anzahl ungelesener Nachrichten | Klick → Inbox |
| **Krankmeldungen** (rot) | Anzahl + betroffene Kinder | Klick → Bottom-Drawer mit Details |
| **Allergien heute** (orange) | Allergien der anwesenden Kinder | Klick → Bottom-Drawer mit Details |

### Iteration
| Version | Höhe | Feedback |
|---------|------|----------|
| V1 | Grosse Karten mit Detail-Listen | "Zu viel Platz, die Kinderliste rutscht zu weit runter" |
| V2 | Minimal (nur Icon + Zahl inline) | "Unterscheidet sich nicht von den Filter-Chips" |
| V3 (final) | Mittel (Icon + Zahl + Label, klickbar) | Kompakt genug, aber klar als eigene Ebene erkennbar |

### Finding
> **Dashboard-Informationen müssen auf einen Blick erfassbar sein, ohne die Hauptansicht zu verdrängen.** Klickbare Widgets mit Bottom-Drawer für Details sind der beste Kompromiss zwischen Überblick und Detailtiefe.

---

## 8. Bottom-Drawers statt Modals

### Alle Aktions-Dialoge kommen als Bottom-Drawer (von unten):
- Check-in (Code-Anzeige + Notiz)
- Check-out (Code-Verifikation + Abholer)
- Krankmeldung (Symptome + Kontakt)
- Allergien (Liste + Erfassung)
- Widget-Details (betroffene Kinder)

### Finding
> **Bottom-Drawers sind das natürliche Pattern für Tablet-Apps.** Sie sind mit dem Daumen erreichbar, verdecken den Kontext nicht komplett, und der Drag-Handle oben signalisiert "kann weggewischt werden". Centered Modals wirken auf Tablets deplatziert.

---

## 9. Tablet-Frame für Testing

### Problem
Im User-Testing am Desktop verstanden Tester nicht, dass es eine Tablet-App ist. Sie versuchten Desktop-Patterns (Hover, Rechtsklick).

### Lösung
Ab 1200px Bildschirmbreite wird die App in einem visuellen Tablet-Rahmen dargestellt (dunkler Bezel, Kamera-Dot, "Origami – Tablet Prototyp" Label).

### Technischer Trick
`transform: scale(1)` auf dem Screen-Container erzeugt einen neuen CSS Containing Block – dadurch bleiben alle `position: fixed` Elemente (Drawers, Navigation) innerhalb des Tablet-Frames.

### Finding
> **Der Device-Frame verbessert die Test-Qualität signifikant.** Tester gehen sofort in den "Tablet-Modus" und nutzen Touch-Patterns statt Desktop-Gewohnheiten.

---

## 10. Navigation: Bottom-Nav für Tablet

### Entscheidung
3-Tab Bottom-Navigation: **Gruppe** · **Inbox** · **Mehr**

### Begründung
- Tablet-natives Pattern (wie iPad-Apps)
- Maximaler Content-Bereich
- Badge auf Inbox zeigt ungelesene Nachrichten
- Nur auf Top-Level-Seiten sichtbar (nicht auf Kind-Detail/Chat)

---

## 11. Avatar-Design: Initialen + Origami-Badge

### Iteration
| Version | Avatar | Feedback |
|---------|--------|----------|
| V1 | Nur Origami-Icon gross | "Welches Kind ist das?" – Icon allein nicht erkennbar |
| V2 | Nur Initialen | Erkennbar, aber die Origami-Figuren gehen verloren |
| V3 (final) | **Initialen-Kreis + kleines Icon-Badge** | Beides erkennbar, Icon-Badge in Pastell-Farbe des Codes |

### Finding
> **Die Kombination aus schnell lesbaren Initialen und dem thematischen Origami-Icon als Badge funktioniert am besten.** Die Pastell-Hintergrundfarbe des Badge verstärkt die visuelle Verbindung zum Abholcode.

---

## Zusammenfassung der wichtigsten Prinzipien

1. **Aktion > Status** – Buttons zeigen was passiert, nicht was ist
2. **Kontext bestimmt den Flow** – gleiche Funktion, unterschiedliche Pfade je nach Zustand
3. **Layout-Controls ≠ Content** – UI-Steuerung visuell vom Inhalt trennen
4. **Kompakt + erweiterbar** – Übersicht oben, Details on-demand (Bottom-Drawer)
5. **Flexibilität > Dogma** – User entscheiden (Pin-Toggle, nicht erzwungenes Split-View)
6. **Animation = Orientierung** – Bewegung zeigt wohin etwas geht, nicht nur dass es sich ändert
7. **Device-Kontext kommunizieren** – Tablet-Frame im Testing, Bottom-Drawers statt Modals
8. **Weniger Klicks > mehr Sicherheit** – Friction die keinen Mehrwert bringt, weglassen
