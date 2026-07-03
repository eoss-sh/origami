// Origami-Figuren (Kinder-Avatare = Abholcode-Figuren)
export type OrigamiFigure =
  | "fuchs"
  | "boot"
  | "schmetterling"
  | "kranich"
  | "frosch"
  | "wal"
  | "katze"
  | "hase"
  | "baer"
  | "vogel"
  | "fisch";

export const FIGURE_LABELS: Record<OrigamiFigure, string> = {
  fuchs: "Fuchs",
  boot: "Boot",
  schmetterling: "Schmetterling",
  kranich: "Kranich",
  frosch: "Frosch",
  wal: "Wal",
  katze: "Katze",
  hase: "Hase",
  baer: "Bär",
  vogel: "Vogel",
  fisch: "Fisch",
};

// Tagesfarben für den Abholcode
export type CodeColor = "blau" | "rot" | "gruen" | "gelb" | "lila" | "orange";

export const CODE_COLORS: { key: CodeColor; label: string; hex: string }[] = [
  { key: "blau", label: "Blau", hex: "#3498DB" },
  { key: "rot", label: "Rot", hex: "#E74C3C" },
  { key: "gruen", label: "Grün", hex: "#3FA46A" },
  { key: "gelb", label: "Gelb", hex: "#F9B233" },
  { key: "lila", label: "Lila", hex: "#9B59B6" },
  { key: "orange", label: "Orange", hex: "#E67E22" },
];

// Allergien / Unverträglichkeiten
export interface Allergy {
  id: string;
  label: string;
  severity?: "mild" | "schwer";
}

// Erziehungsberechtigte / Abholpersonen
export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relation: "Mutter" | "Vater" | "Grosseltern" | "Andere";
}

// Kind
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string; // ISO date
  figure: OrigamiFigure;
  groupId: string;
  isVisitor: boolean; // Besuchskind
  allergies: Allergy[];
  guardians: Guardian[];
}

// Anwesenheit
export interface Attendance {
  id: string;
  childId: string;
  date: string; // ISO date (YYYY-MM-DD)
  checkinAt: string | null; // ISO datetime
  checkoutAt: string | null;
  codeColor: CodeColor | null;
  codeVerified: boolean | null;
  pickedUpByType: "Mutter" | "Vater" | "Andere" | null;
  pickedUpByName: string | null;
}

// Vorfall (Krankmeldung, Abholanfrage etc.)
export type IncidentType = "sick" | "pickup_request";
export type IncidentStatus = "open" | "confirmed" | "closed";
export type Symptom = "fieber" | "erbrechen" | "durchfall" | "ausschlag" | "sonstiges";

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  fieber: "Fieber",
  erbrechen: "Erbrechen",
  durchfall: "Durchfall",
  ausschlag: "Ausschlag",
  sonstiges: "Sonstiges",
};

export interface Incident {
  id: string;
  childId: string;
  type: IncidentType;
  symptom?: Symptom;
  temperature?: string;
  note?: string;
  status: IncidentStatus;
  pickupEta?: string; // z.B. "14:45"
  pickupPerson?: string; // z.B. "Mutter"
  createdAt: string; // ISO datetime
  closedAt?: string;
}

// Chat-Nachrichten
export type MessageDirection = "in" | "out" | "system";

export interface Message {
  id: string;
  childId: string;
  direction: MessageDirection;
  body: string;
  createdAt: string; // ISO datetime
  readAt?: string;
}

// Journal-Eintrag (abgeleitete Sicht)
export type JournalKind =
  | "checkin"
  | "checkout"
  | "sick"
  | "pickup_request"
  | "pickup_confirmed"
  | "message"
  | "code_failed";

export interface JournalEntry {
  id: string;
  childId: string;
  date: string;
  kind: JournalKind;
  description: string;
  timestamp: string; // ISO datetime
}

// Filter-Optionen für die Gruppenliste
export type GroupFilter = "alle" | "hier" | "fehlt" | "allergien";
