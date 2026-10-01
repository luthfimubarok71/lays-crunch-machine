import { describe, it, expect } from "vitest";
import {
  INITIAL_SESSION,
  SCENARIOS,
  sessionReducer,
  participantsCsv,
  csvCell,
  resultUrl,
  safeParticipants,
} from "../../src/domain/demo";
import { SEED_PARTICIPANTS } from "../../src/adapters/demo/fixtures";
describe("demo state machine", () => {
  it("cannot skip registration or advance without an active participant", () => {
    expect(
      sessionReducer({ ...INITIAL_SESSION, step: 2 }, { type: "NEXT", from: 2 })
        .step,
    ).toBe(2);
    expect(
      sessionReducer({ ...INITIAL_SESSION, step: 5 }, { type: "NEXT", from: 5 })
        .step,
    ).toBe(5);
    const advanced = sessionReducer(INITIAL_SESSION, { type: "NEXT", from: 0 });
    expect(sessionReducer(advanced, { type: "NEXT", from: 0 })).toEqual(
      advanced,
    );
  });
  it("accepts registration once and resets participant identity", () => {
    const s = sessionReducer(
      { ...INITIAL_SESSION, step: 2 },
      { type: "REGISTER", id: "DEMO-first" },
    );
    expect(sessionReducer(s, { type: "REGISTER", id: "DEMO-second" })).toEqual(
      s,
    );
    expect(sessionReducer(s, { type: "RESET" })).toEqual(INITIAL_SESSION);
  });
  it("freezes scenario after starting and permits controlled invalid retry", () => {
    const s = { step: 7, activeId: "DEMO-first", scenario: "invalid" as const };
    expect(sessionReducer(s, { type: "SCENARIO", scenario: "win" })).toEqual(s);
    expect(sessionReducer(s, { type: "RETRY" })).toEqual({
      ...s,
      step: 4,
      scenario: "win",
    });
  });
});
describe("synthetic fixture invariants", () => {
  it("invalid never qualifies, pending does not claim successful delivery", () => {
    expect(SCENARIOS.invalid.score).toBeNull();
    expect(SCENARIOS.invalid.reward).toBe(false);
    expect(SCENARIOS.pending.video).toBe("pending");
    expect(SCENARIOS.pending.email).toBe("queued");
    expect(SCENARIOS.win.score).toBe(92);
    expect(SCENARIOS["no-win"].score).toBe(64);
  });
  it("drops arbitrary personal fields from restored browser data", () => {
    const raw = [
      {
        ...SEED_PARTICIPANTS[0],
        name: "Real person",
        email: "real@private.org",
      },
    ];
    expect(safeParticipants(raw)).toEqual([SEED_PARTICIPANTS[0]]);
    expect(safeParticipants([{ ...raw[0], identity: 100 }])).toBeNull();
    expect(safeParticipants([{ ...raw[0], scenario: "fake" }])).toBeNull();
    expect(safeParticipants("not an array")).toBeNull();
  });
});
describe("export and public result URLs", () => {
  it("escapes delimiters, quotes and spreadsheet formulas", () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
    expect(csvCell("=SUM(A1)")).toBe('"\'=SUM(A1)"');
    expect(csvCell(" +cmd")).toBe('"\' +cmd"');
    const csv = participantsCsv(SEED_PARTICIPANTS);
    expect(csv).toContain("DEMO / SINTETIS");
    expect(csv).not.toContain("https://");
    expect(csv).not.toContain("example.com");
  });
  it("does not expose score or reward for an incomplete attempt", () => {
    const csv = participantsCsv([
      { ...SEED_PARTICIPANTS[2], status: "registered" },
    ]);
    expect(csv).not.toContain('"92"');
    expect(csv).toContain("Belum dievaluasi");
  });
  it("rejects loopback and unsafe QR origins", () => {
    for (const origin of [
      "http://localhost:3000",
      "http://127.0.0.2",
      "http://[::1]",
      "javascript:alert(1)",
      "bad",
    ])
      expect(resultUrl(origin, "win")).toBeNull();
    expect(resultUrl("https://demo.example.com/foo?email=secret", "win")).toBe(
      "https://demo.example.com/demo/result/win",
    );
    expect(resultUrl("http://192.168.1.50:3000", "pending")).toBe(
      "http://192.168.1.50:3000/demo/result/pending",
    );
  });
});
