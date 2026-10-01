// Ports for future adapters. Milestone 1 supplies only synthetic data.
import type { ScenarioId } from "./demo";
export interface CaptureResult {
  durationMs: number;
  source: "synthetic" | "browser" | "native";
  blob?: Blob;
  error?: string;
}
export interface MediaCaptureAdapter {
  prepare(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<CaptureResult>;
  dispose(): void;
}
export interface ScoreResult {
  score: number | null;
  valid: boolean;
  source: "simulated" | "measured";
  profileVersion: string;
  reason?: string;
}
export interface DeliveryResult {
  scenario: ScenarioId;
  status: "ready" | "pending" | "unavailable";
  publicPath: string;
}
