export const STEPS = [
  "Join",
  "Welcome",
  "Registrasi",
  "Tutorial",
  "Persiapan",
  "Countdown",
  "Crunch!",
  "Hasil",
  "Reward",
  "Video",
  "Share",
  "Finish",
] as const;
export type ScenarioId = "win" | "no-win" | "invalid" | "pending";
export interface Scenario {
  id: ScenarioId;
  label: string;
  score: number | null;
  reward: boolean;
  video: "ready" | "pending" | "unavailable";
  email: "delivered" | "queued" | "not-sent";
  title: string;
  description: string;
}
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  win: {
    id: "win",
    label: "Epic crunch · Menang",
    score: 92,
    reward: true,
    video: "ready",
    email: "delivered",
    title: "EPIC CRUNCH!",
    description: "Crunch kamu mencuri perhatian. Ini momenmu!",
  },
  "no-win": {
    id: "no-win",
    label: "Good crunch · Belum menang",
    score: 64,
    reward: false,
    video: "ready",
    email: "delivered",
    title: "GOOD CRUNCH!",
    description: "Good crunch. Great energy. Terima kasih sudah ikut!",
  },
  invalid: {
    id: "invalid",
    label: "Input invalid · Ulangi",
    score: null,
    reward: false,
    video: "unavailable",
    email: "not-sent",
    title: "LET’S TRY AGAIN.",
    description:
      "Simulasi input terputus. Tidak ada skor atau hadiah yang diterbitkan.",
  },
  pending: {
    id: "pending",
    label: "Video pending · Menunggu",
    score: 88,
    reward: true,
    video: "pending",
    email: "queued",
    title: "LOUD & PROUD!",
    description:
      "Crunch selesai. Video contoh masih dalam simulasi pemrosesan.",
  },
};
export const IDENTITIES = [
  { name: "Alya Demo", email: "alya@example.com", initials: "AD" },
  { name: "Bima Demo", email: "bima@example.com", initials: "BD" },
  { name: "Citra Demo", email: "citra@example.com", initials: "CD" },
  { name: "Dimas Demo", email: "dimas@example.com", initials: "DD" },
] as const;
export interface DemoParticipant {
  id: string;
  identity: number;
  scenario: ScenarioId;
  status: "registered" | "completed" | "invalid";
  createdAt: string;
  durationMs: number | null;
}
export interface DemoSession {
  step: number;
  activeId: string | null;
  scenario: ScenarioId;
}
export const INITIAL_SESSION: DemoSession = {
  step: 0,
  activeId: null,
  scenario: "win",
};
export type SessionEvent =
  | { type: "NEXT"; from: number }
  | { type: "REGISTER"; id: string }
  | { type: "SCENARIO"; scenario: ScenarioId }
  | { type: "RETRY" }
  | { type: "RESET" };
export function sessionReducer(
  state: DemoSession,
  event: SessionEvent,
): DemoSession {
  switch (event.type) {
    case "RESET":
      return { ...INITIAL_SESSION, scenario: state.scenario };
    case "SCENARIO":
      return state.step === 0 ? { ...state, scenario: event.scenario } : state;
    case "REGISTER":
      return state.step === 2 && !state.activeId
        ? { ...state, activeId: event.id, step: 3 }
        : state;
    case "RETRY":
      return state.step === 7 && state.scenario === "invalid"
        ? { ...state, scenario: "win", step: 4 }
        : state;
    case "NEXT":
      return event.from !== state.step ||
        state.step === 2 ||
        state.step >= 11 ||
        (state.step >= 3 && !state.activeId)
        ? state
        : { ...state, step: state.step + 1 };
  }
}
export const SAMPLE_VIDEO = "/demo/crunch-sample.mp4";
export const SAMPLE_POSTER = "/demo/crunch-poster.webp";
export function isScenario(value: unknown): value is ScenarioId {
  return typeof value === "string" && Object.hasOwn(SCENARIOS, value);
}
export function safeParticipants(value: unknown): DemoParticipant[] | null {
  if (!Array.isArray(value)) return null;
  const valid = value.every(
    (p) =>
      p &&
      typeof p === "object" &&
      /^DEMO-[a-zA-Z0-9-]{1,50}$/.test(p.id) &&
      Number.isInteger(p.identity) &&
      p.identity >= 0 &&
      p.identity < IDENTITIES.length &&
      isScenario(p.scenario) &&
      ["registered", "completed", "invalid"].includes(p.status) &&
      typeof p.createdAt === "string" &&
      Number.isFinite(Date.parse(p.createdAt)) &&
      (p.durationMs === null ||
        (typeof p.durationMs === "number" &&
          p.durationMs >= 10000 &&
          p.durationMs < 120000)),
  );
  return valid
    ? value.slice(-50).map((p) => ({
        id: p.id,
        identity: p.identity,
        scenario: p.scenario,
        status: p.status,
        createdAt: p.createdAt,
        durationMs: p.durationMs,
      }))
    : null;
}
export function csvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function participantsCsv(rows: DemoParticipant[]) {
  const records = rows.map((p) => {
    const s = SCENARIOS[p.scenario];
    return [
      p.id,
      IDENTITIES[p.identity].name,
      p.createdAt,
      p.status,
      p.status === "completed" ? s.score : "",
      p.status === "completed"
        ? s.reward
          ? "Hadiah simulasi"
          : "Belum menang"
        : "Belum dievaluasi",
      p.status === "completed" ? s.video : "unavailable",
      p.status === "completed" ? s.email : "not-sent",
      "DEMO / SINTETIS",
    ];
  });
  return (
    "\uFEFF" +
    [
      [
        "ID",
        "Nama sintetis",
        "Waktu ISO",
        "Status",
        "Crunch Score",
        "Reward",
        "Video",
        "Email",
        "Mode",
      ],
      ...records,
    ]
      .map((r) => r.map(csvCell).join(","))
      .join("\r\n")
  );
}
export function resultUrl(origin: string, scenario: ScenarioId): string | null {
  try {
    const url = new URL(origin);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      ["localhost", "[::1]", "0.0.0.0"].includes(url.hostname) ||
      url.hostname.endsWith(".localhost") ||
      /^127\./.test(url.hostname)
    )
      return null;
    return `${url.origin}/demo/result/${scenario}`;
  } catch {
    return null;
  }
}
