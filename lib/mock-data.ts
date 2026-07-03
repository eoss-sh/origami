import type { Child, Attendance, Message } from "@/types";

// Heute als ISO-Datum
const TODAY = new Date().toISOString().split("T")[0];

export const GROUP = {
  id: "igel",
  name: "Igel",
};

export const CHILDREN: Child[] = [
  {
    id: "1",
    firstName: "Ben",
    lastName: "Meier",
    birthdate: "2022-03-15",
    figure: "fuchs",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g1", name: "Anna Meier", phone: "+41 79 123 45 67", relation: "Mutter" },
      { id: "g2", name: "Thomas Meier", phone: "+41 79 234 56 78", relation: "Vater" },
    ],
  },
  {
    id: "2",
    firstName: "Mila",
    lastName: "Brunner",
    birthdate: "2021-08-22",
    figure: "schmetterling",
    groupId: "igel",
    isVisitor: false,
    allergies: [{ id: "a1", label: "Laktose", severity: "mild" }],
    guardians: [
      { id: "g3", name: "Sarah Brunner", phone: "+41 79 345 67 89", relation: "Mutter" },
    ],
  },
  {
    id: "3",
    firstName: "Noah",
    lastName: "Keller",
    birthdate: "2022-01-10",
    figure: "boot",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g4", name: "Lisa Keller", phone: "+41 79 456 78 90", relation: "Mutter" },
      { id: "g5", name: "Marco Keller", phone: "+41 79 567 89 01", relation: "Vater" },
    ],
  },
  {
    id: "4",
    firstName: "Emma",
    lastName: "Fischer",
    birthdate: "2021-11-05",
    figure: "kranich",
    groupId: "igel",
    isVisitor: false,
    allergies: [
      { id: "a2", label: "Erdnüsse", severity: "schwer" },
      { id: "a3", label: "Haselnüsse", severity: "schwer" },
    ],
    guardians: [
      { id: "g6", name: "Julia Fischer", phone: "+41 79 678 90 12", relation: "Mutter" },
    ],
  },
  {
    id: "5",
    firstName: "Liam",
    lastName: "Weber",
    birthdate: "2022-06-18",
    figure: "frosch",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g7", name: "Claudia Weber", phone: "+41 79 789 01 23", relation: "Mutter" },
      { id: "g8", name: "Daniel Weber", phone: "+41 79 890 12 34", relation: "Vater" },
    ],
  },
  {
    id: "6",
    firstName: "Sofia",
    lastName: "Müller",
    birthdate: "2021-04-30",
    figure: "katze",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g9", name: "Andrea Müller", phone: "+41 79 901 23 45", relation: "Mutter" },
    ],
  },
  {
    id: "7",
    firstName: "Leon",
    lastName: "Huber",
    birthdate: "2022-09-12",
    figure: "hase",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g10", name: "Petra Huber", phone: "+41 79 012 34 56", relation: "Mutter" },
      { id: "g11", name: "Stefan Huber", phone: "+41 79 123 45 00", relation: "Vater" },
    ],
  },
  {
    id: "8",
    firstName: "Lea",
    lastName: "Schmid",
    birthdate: "2021-12-20",
    figure: "wal",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g12", name: "Monika Schmid", phone: "+41 79 234 56 00", relation: "Mutter" },
    ],
  },
  {
    id: "9",
    firstName: "Finn",
    lastName: "Steiner",
    birthdate: "2022-05-25",
    figure: "baer",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g13", name: "Nina Steiner", phone: "+41 79 345 67 00", relation: "Mutter" },
      { id: "g14", name: "Reto Steiner", phone: "+41 79 456 78 00", relation: "Vater" },
    ],
  },
  {
    id: "10",
    firstName: "Lia",
    lastName: "Gerber",
    birthdate: "2021-07-14",
    figure: "vogel",
    groupId: "igel",
    isVisitor: false,
    allergies: [],
    guardians: [
      { id: "g15", name: "Sandra Gerber", phone: "+41 79 567 89 00", relation: "Mutter" },
    ],
  },
  {
    id: "11",
    firstName: "Matteo",
    lastName: "Rossi",
    birthdate: "2022-02-08",
    figure: "fisch",
    groupId: "igel",
    isVisitor: true, // Besuchskind!
    allergies: [{ id: "a4", label: "Gluten", severity: "schwer" }],
    guardians: [
      { id: "g16", name: "Elena Rossi", phone: "+41 79 678 90 00", relation: "Mutter" },
    ],
  },
];

// Initial-Anwesenheiten: einige Kinder sind schon eingecheckt
export const INITIAL_ATTENDANCES: Attendance[] = [
  {
    id: "att-1",
    childId: "1", // Ben
    date: TODAY,
    checkinAt: `${TODAY}T07:45:00`,
    checkoutAt: null,
    codeColor: "blau",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-2",
    childId: "2", // Mila
    date: TODAY,
    checkinAt: `${TODAY}T08:00:00`,
    checkoutAt: null,
    codeColor: "rot",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-3",
    childId: "3", // Noah
    date: TODAY,
    checkinAt: `${TODAY}T07:55:00`,
    checkoutAt: null,
    codeColor: "gruen",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-4",
    childId: "4", // Emma
    date: TODAY,
    checkinAt: `${TODAY}T08:10:00`,
    checkoutAt: null,
    codeColor: "gelb",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-5",
    childId: "5", // Liam
    date: TODAY,
    checkinAt: `${TODAY}T08:05:00`,
    checkoutAt: null,
    codeColor: "lila",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-6",
    childId: "6", // Sofia
    date: TODAY,
    checkinAt: `${TODAY}T07:50:00`,
    checkoutAt: null,
    codeColor: "orange",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
  {
    id: "att-7",
    childId: "11", // Matteo (Besuchskind)
    date: TODAY,
    checkinAt: `${TODAY}T08:15:00`,
    checkoutAt: null,
    codeColor: "blau",
    codeVerified: null,
    pickedUpByType: null,
    pickedUpByName: null,
  },
];

// Initiale System-Nachrichten (Abholcodes)
export const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    childId: "1",
    direction: "system",
    body: "Bens Code heute: blauer Fuchs 🦊",
    createdAt: `${TODAY}T07:45:00`,
  },
  {
    id: "msg-2",
    childId: "2",
    direction: "system",
    body: "Milas Code heute: roter Schmetterling 🦋",
    createdAt: `${TODAY}T08:00:00`,
  },
  {
    id: "msg-3",
    childId: "4",
    direction: "system",
    body: "Emmas Code heute: gelber Kranich 🕊️",
    createdAt: `${TODAY}T08:10:00`,
  },
  {
    id: "msg-4",
    childId: "11",
    direction: "system",
    body: "Matteos Code heute: blauer Fisch 🐟",
    createdAt: `${TODAY}T08:15:00`,
  },
];
