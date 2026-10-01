"use client";
import { useEffect, useRef, useState } from "react";
import { Waveform } from "@/components/campaign/artwork";
export function ChallengeClock({
  mode,
  score,
  onDone,
}: {
  mode: "countdown" | "recording";
  score?: number | null;
  onDone: (duration: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const callback = useRef(onDone);
  useEffect(() => {
    callback.current = onDone;
  }, [onDone]);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = mode === "countdown" ? 3000 : 10000;
    let finished = false;
    function tick() {
      const delta = performance.now() - start;
      setElapsed(Math.min(delta, duration));
      if (delta >= duration) {
        if (!finished) {
          finished = true;
          callback.current(duration);
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode]);
  if (mode === "countdown")
    return (
      <div className="countdown-screen">
        <span className="card-kicker">READY. SET.</span>
        <div className="countdown-ring">
          <span key={Math.ceil((3000 - elapsed) / 1000)}>
            {Math.max(1, Math.ceil((3000 - elapsed) / 1000))}
          </span>
        </div>
        <h2>LET’S CRUNCH!</h2>
        <p>Countdown visual · Audio tidak aktif</p>
      </div>
    );
  return (
    <div className="recording-screen">
      <div className="recording-top">
        <span>
          <i /> SIMULATED REC
        </span>
        <b data-testid="challenge-timer">
          00:
          {String(Math.max(0, 10 - Math.floor(elapsed / 1000))).padStart(
            2,
            "0",
          )}
        </b>
      </div>
      <h2>
        CRUNCH
        <br />
        IN PROGRESS<span>✳</span>
      </h2>
      <Waveform animated dark />
      <div className="live-score">
        {score === null
          ? "—"
          : Math.round((score ?? 0) * Math.min(1, elapsed / 8500))}
        <span>DEMO SCORE</span>
      </div>
      <div className="recording-progress">
        <i style={{ width: `${elapsed / 100}%` }} />
      </div>
      <p>10 detik simulasi · Tidak merekam perangkat</p>
    </div>
  );
}
