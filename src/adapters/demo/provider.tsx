"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_SESSION,
  sessionReducer,
  safeParticipants,
  type DemoParticipant,
  type DemoSession,
  type ScenarioId,
} from "@/domain/demo";
import { SEED_PARTICIPANTS } from "./fixtures";
const KEY = "lays-demo-v1-synthetic";
interface DemoContextValue {
  rows: DemoParticipant[];
  session: DemoSession;
  hydrated: boolean;
  storageWarning: boolean;
  next(): void;
  register(identity: number): void;
  finishCapture(durationMs: number): void;
  reset(): void;
  retry(): void;
  chooseScenario(id: ScenarioId): void;
}
const DemoContext = createContext<DemoContextValue | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<DemoParticipant[]>(SEED_PARTICIPANTS);
  const [session, dispatch] = useReducer(sessionReducer, INITIAL_SESSION);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const registrationLock = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = safeParticipants(JSON.parse(raw));
        if (parsed) setRows(parsed);
      }
    } catch {
      setStorageWarning(true);
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(rows));
    } catch {
      setStorageWarning(true);
    }
  }, [rows, hydrated]);
  function register(identity: number) {
    if (
      session.step !== 2 ||
      registrationLock.current ||
      identity < 0 ||
      identity > 3
    )
      return;
    registrationLock.current = true;
    const randomId =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
            b.toString(16).padStart(2, "0"),
          ).join("");
    const id = `DEMO-${randomId}`;
    const participant: DemoParticipant = {
      id,
      identity,
      scenario: session.scenario,
      status: "registered",
      createdAt: new Date().toISOString(),
      durationMs: null,
    };
    setRows((r) => [participant, ...r].slice(0, 50));
    dispatch({ type: "REGISTER", id });
  }
  function finishCapture(durationMs: number) {
    if (session.step !== 6 || durationMs < 10000) return;
    setRows((r) =>
      r.map((p) =>
        p.id === session.activeId
          ? {
              ...p,
              scenario: session.scenario,
              status: session.scenario === "invalid" ? "invalid" : "completed",
              durationMs,
            }
          : p,
      ),
    );
    dispatch({ type: "NEXT", from: 6 });
  }
  function reset() {
    registrationLock.current = false;
    dispatch({ type: "RESET" });
  }
  return (
    <DemoContext.Provider
      value={{
        rows,
        session,
        hydrated,
        storageWarning,
        next: () => dispatch({ type: "NEXT", from: session.step }),
        register,
        finishCapture,
        reset,
        retry: () => dispatch({ type: "RETRY" }),
        chooseScenario: (scenario) => dispatch({ type: "SCENARIO", scenario }),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider required");
  return value;
}
