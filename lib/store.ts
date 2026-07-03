import { create } from "zustand";
import type {
  Child,
  ChildGroup,
  Attendance,
  Incident,
  Message,
  GroupFilter,
  CodeColor,
  Symptom,
  IncidentStatus,
  JournalEntry,
} from "@/types";
import { CODE_COLORS, FIGURE_LABELS } from "@/types";
import { CHILDREN, INITIAL_ATTENDANCES, INITIAL_MESSAGES, GROUP } from "./mock-data";

const TODAY = new Date().toISOString().split("T")[0];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function randomColor(): CodeColor {
  const idx = Math.floor(Math.random() * CODE_COLORS.length);
  return CODE_COLORS[idx].key;
}

function now() {
  return new Date().toISOString();
}

interface AppState {
  // Data
  group: { id: string; name: string };
  children: Child[];
  attendances: Attendance[];
  incidents: Incident[];
  messages: Message[];

  // UI State
  filter: GroupFilter;
  searchQuery: string;

  // Actions
  setFilter: (filter: GroupFilter) => void;
  setSearchQuery: (query: string) => void;

  // Attendance
  checkIn: (childId: string) => { colorLabel: string; figureLabel: string } | null;
  checkOut: (
    childId: string,
    pickedUpByType: "Mutter" | "Vater" | "Andere",
    pickedUpByName: string | null,
    codeVerified: boolean
  ) => void;

  // Incidents
  addSickReport: (
    childId: string,
    symptom: Symptom,
    temperature?: string,
    note?: string
  ) => void;
  removeSickReport: (childId: string) => void;
  requestPickup: (childId: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, eta?: string, person?: string) => void;

  // Messages
  sendMessage: (childId: string, body: string) => void;
  receiveMessage: (childId: string, body: string) => void;
  addSystemMessage: (childId: string, body: string) => void;
  markMessagesRead: (childId: string) => void;

  // Derived
  getAttendance: (childId: string) => Attendance | undefined;
  isCheckedIn: (childId: string) => boolean;
  getChildById: (childId: string) => Child | undefined;
  getIncidents: (childId: string) => Incident[];
  getMessages: (childId: string) => Message[];
  getUnreadCount: (childId: string) => number;
  getJournal: (childId: string) => JournalEntry[];
  getFilteredChildren: () => Child[];
  getGroupedChildren: () => ChildGroup[];
  getPresentCount: () => number;
  getTotalUnreadCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  group: GROUP,
  children: CHILDREN,
  attendances: [...INITIAL_ATTENDANCES],
  incidents: [],
  messages: [...INITIAL_MESSAGES],
  filter: "alle",
  searchQuery: "",

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  checkIn: (childId) => {
    const state = get();
    const existing = state.attendances.find(
      (a) => a.childId === childId && a.date === TODAY
    );

    const child = state.children.find((c) => c.id === childId);
    if (!child) return null;

    // Already checked in and not checked out → no-op
    if (existing && existing.checkinAt && !existing.checkoutAt) return null;

    // Re-check-in after checkout: reuse existing code (F2.4)
    if (existing && existing.checkoutAt && existing.codeColor) {
      const colorLabel = CODE_COLORS.find((c) => c.key === existing.codeColor)?.label ?? "";
      const figureLabel = FIGURE_LABELS[child.figure];
      set({
        attendances: state.attendances.map((a) =>
          a.id === existing.id
            ? { ...a, checkinAt: now(), checkoutAt: null, codeVerified: null, pickedUpByType: null, pickedUpByName: null }
            : a
        ),
      });
      return { colorLabel, figureLabel };
    }

    // Fresh check-in: generate new code
    const color = randomColor();
    const colorLabel = CODE_COLORS.find((c) => c.key === color)?.label ?? color;
    const figureLabel = FIGURE_LABELS[child.figure];

    if (existing) {
      set({
        attendances: state.attendances.map((a) =>
          a.id === existing.id
            ? { ...a, checkinAt: now(), codeColor: color, checkoutAt: null }
            : a
        ),
      });
    } else {
      const attendance: Attendance = {
        id: `att-${generateId()}`,
        childId,
        date: TODAY,
        checkinAt: now(),
        checkoutAt: null,
        codeColor: color,
        codeVerified: null,
        pickedUpByType: null,
        pickedUpByName: null,
      };
      set({ attendances: [...state.attendances, attendance] });
    }

    // System message for pickup code
    const msg: Message = {
      id: `msg-${generateId()}`,
      childId,
      direction: "system",
      body: `${child.firstName}s Code heute: ${colorLabel.toLowerCase()}er ${figureLabel}`,
      createdAt: now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));

    return { colorLabel, figureLabel };
  },

  checkOut: (childId, pickedUpByType, pickedUpByName, codeVerified) => {
    const state = get();
    set({
      attendances: state.attendances.map((a) =>
        a.childId === childId && a.date === TODAY
          ? {
              ...a,
              checkoutAt: now(),
              codeVerified,
              pickedUpByType,
              pickedUpByName:
                pickedUpByType === "Andere" ? pickedUpByName : null,
            }
          : a
      ),
    });

    // Close open incidents
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.childId === childId && i.status !== "closed"
          ? { ...i, status: "closed" as const, closedAt: now() }
          : i
      ),
    }));
  },

  addSickReport: (childId, symptom, temperature, note) => {
    const incident: Incident = {
      id: `inc-${generateId()}`,
      childId,
      type: "sick",
      symptom,
      temperature,
      note,
      status: "open",
      createdAt: now(),
    };
    set((s) => ({ incidents: [...s.incidents, incident] }));

    const child = get().children.find((c) => c.id === childId);
    if (child) {
      const msg: Message = {
        id: `msg-${generateId()}`,
        childId,
        direction: "system",
        body: `Krankmeldung erfasst: ${child.firstName} – ${symptom}${temperature ? `, ${temperature}°C` : ""}`,
        createdAt: now(),
      };
      set((s) => ({ messages: [...s.messages, msg] }));
    }
  },

  removeSickReport: (childId) => {
    const state = get();
    const child = state.children.find((c) => c.id === childId);
    set({
      incidents: state.incidents.map((i) =>
        i.childId === childId && i.type === "sick" && i.status !== "closed"
          ? { ...i, status: "closed" as const, closedAt: now() }
          : i
      ),
    });
    if (child) {
      const msg: Message = {
        id: `msg-${generateId()}`,
        childId,
        direction: "system",
        body: `Krankmeldung für ${child.firstName} aufgehoben`,
        createdAt: now(),
      };
      set((s) => ({ messages: [...s.messages, msg] }));
    }
  },

  requestPickup: (childId) => {
    const state = get();
    const child = state.children.find((c) => c.id === childId);
    if (!child) return;

    const incident: Incident = {
      id: `inc-${generateId()}`,
      childId,
      type: "pickup_request",
      status: "open",
      createdAt: now(),
    };
    set((s) => ({ incidents: [...s.incidents, incident] }));

    const msg: Message = {
      id: `msg-${generateId()}`,
      childId,
      direction: "system",
      body: `Abholanfrage gesendet an ${child.guardians.map((g) => g.name).join(", ")}`,
      createdAt: now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  updateIncidentStatus: (incidentId, status, eta, person) => {
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status,
              pickupEta: eta ?? i.pickupEta,
              pickupPerson: person ?? i.pickupPerson,
              closedAt: status === "closed" ? now() : i.closedAt,
            }
          : i
      ),
    }));
  },

  sendMessage: (childId, body) => {
    const msg: Message = {
      id: `msg-${generateId()}`,
      childId,
      direction: "out",
      body,
      createdAt: now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  receiveMessage: (childId, body) => {
    const msg: Message = {
      id: `msg-${generateId()}`,
      childId,
      direction: "in",
      body,
      createdAt: now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  addSystemMessage: (childId, body) => {
    const msg: Message = {
      id: `msg-${generateId()}`,
      childId,
      direction: "system",
      body,
      createdAt: now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  markMessagesRead: (childId) => {
    const timestamp = now();
    set((s) => ({
      messages: s.messages.map((m) =>
        m.childId === childId && !m.readAt ? { ...m, readAt: timestamp } : m
      ),
    }));
  },

  // Derived getters
  getAttendance: (childId) => {
    return get().attendances.find(
      (a) => a.childId === childId && a.date === TODAY
    );
  },

  isCheckedIn: (childId) => {
    const att = get().getAttendance(childId);
    return !!att?.checkinAt && !att?.checkoutAt;
  },

  getChildById: (childId) => {
    return get().children.find((c) => c.id === childId);
  },

  getIncidents: (childId) => {
    return get().incidents.filter((i) => i.childId === childId);
  },

  getMessages: (childId) => {
    return get().messages
      .filter((m) => m.childId === childId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  getUnreadCount: (childId) => {
    return get().messages.filter(
      (m) => m.childId === childId && m.direction === "in" && !m.readAt
    ).length;
  },

  getJournal: (childId) => {
    const state = get();
    const entries: JournalEntry[] = [];

    // Attendance entries
    const att = state.attendances.find(
      (a) => a.childId === childId && a.date === TODAY
    );
    if (att?.checkinAt) {
      const colorLabel =
        CODE_COLORS.find((c) => c.key === att.codeColor)?.label ?? "";
      const child = state.children.find((c) => c.id === childId);
      const figureLabel = child ? FIGURE_LABELS[child.figure] : "";
      entries.push({
        id: `j-${att.id}-in`,
        childId,
        date: TODAY,
        kind: "checkin",
        description: `Check-in – Code: ${colorLabel.toLowerCase()}er ${figureLabel}`,
        timestamp: att.checkinAt,
      });
    }
    if (att?.checkoutAt) {
      entries.push({
        id: `j-${att.id}-out`,
        childId,
        date: TODAY,
        kind: "checkout",
        description: `Check-out – Abgeholt von ${att.pickedUpByType}${att.pickedUpByName ? ` (${att.pickedUpByName})` : ""}, Code ${att.codeVerified ? "verifiziert" : "nicht verifiziert"}`,
        timestamp: att.checkoutAt,
      });
    }

    // Incident entries
    state.incidents
      .filter((i) => i.childId === childId)
      .forEach((i) => {
        entries.push({
          id: `j-${i.id}`,
          childId,
          date: TODAY,
          kind: i.type === "sick" ? "sick" : "pickup_request",
          description:
            i.type === "sick"
              ? `Krankmeldung: ${i.symptom}${i.temperature ? `, ${i.temperature}°C` : ""}${i.note ? ` – ${i.note}` : ""}`
              : `Abholanfrage – Status: ${i.status}${i.pickupEta ? `, ETA ${i.pickupEta}` : ""}`,
          timestamp: i.createdAt,
        });
        if (i.status === "confirmed" && i.pickupEta) {
          entries.push({
            id: `j-${i.id}-conf`,
            childId,
            date: TODAY,
            kind: "pickup_confirmed",
            description: `Abholung bestätigt: ${i.pickupPerson ?? "Elternteil"} unterwegs, ca. ${i.pickupEta}`,
            timestamp: i.createdAt,
          });
        }
      });

    // Note entries (system messages starting with "Notiz:")
    state.messages
      .filter(
        (m) =>
          m.childId === childId &&
          m.direction === "system" &&
          m.body.startsWith("Notiz:")
      )
      .forEach((m) => {
        entries.push({
          id: `j-${m.id}`,
          childId,
          date: TODAY,
          kind: "message",
          description: m.body,
          timestamp: m.createdAt,
        });
      });

    return entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  getFilteredChildren: () => {
    const state = get();
    let filtered = state.children;

    // Apply filter
    switch (state.filter) {
      case "hier":
        filtered = filtered.filter((c) => state.isCheckedIn(c.id));
        break;
      case "fehlt":
        filtered = filtered.filter((c) => !state.isCheckedIn(c.id));
        break;
      case "allergien":
        filtered = filtered.filter((c) => c.allergies.length > 0);
        break;
    }

    // Apply search
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q)
      );
    }

    // Sort: sick children (not checked in) to the end
    filtered = [...filtered].sort((a, b) => {
      const aSick = state.incidents.some(
        (i) => i.childId === a.id && i.type === "sick" && i.status !== "closed"
      ) && !state.isCheckedIn(a.id);
      const bSick = state.incidents.some(
        (i) => i.childId === b.id && i.type === "sick" && i.status !== "closed"
      ) && !state.isCheckedIn(b.id);
      if (aSick === bSick) return 0;
      return aSick ? 1 : -1;
    });

    return filtered;
  },

  getGroupedChildren: () => {
    const state = get();
    const filtered = state.getFilteredChildren();

    const anwesend: Child[] = [];
    const abwesend: Child[] = [];
    const krank: Child[] = [];

    for (const child of filtered) {
      const checkedIn = state.isCheckedIn(child.id);
      const isSick = state.incidents.some(
        (i) => i.childId === child.id && i.type === "sick" && i.status !== "closed"
      );

      if (checkedIn) {
        anwesend.push(child);
      } else if (isSick) {
        krank.push(child);
      } else {
        abwesend.push(child);
      }
    }

    return ([
      { key: "anwesend" as const, label: "Anwesend", children: anwesend },
      { key: "abwesend" as const, label: "Abwesend", children: abwesend },
      { key: "krank" as const, label: "Krank", children: krank },
    ] satisfies ChildGroup[]).filter((g) => g.children.length > 0);
  },

  getPresentCount: () => {
    return get().children.filter((c) => get().isCheckedIn(c.id)).length;
  },

  getTotalUnreadCount: () => {
    const state = get();
    return state.children.reduce((sum, c) => sum + state.getUnreadCount(c.id), 0);
  },
}));
