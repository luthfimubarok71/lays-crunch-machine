import type { DemoParticipant } from "@/domain/demo";
export const SEED_PARTICIPANTS: DemoParticipant[] = [
  {
    id: "DEMO-1003",
    identity: 2,
    scenario: "pending",
    status: "completed",
    createdAt: "2026-10-01T08:42:00Z",
    durationMs: 10000,
  },
  {
    id: "DEMO-1002",
    identity: 1,
    scenario: "no-win",
    status: "completed",
    createdAt: "2026-10-01T08:38:00Z",
    durationMs: 10000,
  },
  {
    id: "DEMO-1001",
    identity: 0,
    scenario: "win",
    status: "completed",
    createdAt: "2026-10-01T08:34:00Z",
    durationMs: 10000,
  },
];
