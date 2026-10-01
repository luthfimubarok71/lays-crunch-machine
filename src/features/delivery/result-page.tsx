"use client";
import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, AlertTriangle } from "lucide-react";
import { SCENARIOS, type ScenarioId } from "@/domain/demo";
import { Header, Footer } from "@/components/campaign/header";
import { VideoPlayer } from "@/components/campaign/video-player";
import { SocialInstructions } from "@/components/campaign/social-instructions";
export function ResultPage({ scenarioId }: { scenarioId: ScenarioId }) {
  const s = SCENARIOS[scenarioId];
  return (
    <div className="campaign-page result-page">
      <Header result />
      <main className="mobile-result">
        <div className="result-intro">
          <span className="eyebrow">A LITTLE CHIP. A BIG MEMORY.</span>
          <h1>
            YOUR CRUNCH.
            <br />
            <span className="red-word">ON REPEAT.</span>
          </h1>
          <p>Halaman hasil sintetis · Skenario {s.label}</p>
        </div>
        <div className="mobile-result-grid">
          <section className="result-video-card">
            {s.video === "ready" ? (
              <VideoPlayer download />
            ) : (
              <div className="pending-video">
                {s.video === "pending" ? (
                  <Clock3 size={42} />
                ) : (
                  <AlertTriangle size={42} />
                )}
                <h2>
                  {s.video === "pending"
                    ? "MOMENT IN THE MAKING."
                    : "NO RECORDING THIS TIME."}
                </h2>
                <p>
                  {s.video === "pending"
                    ? "Video sedang diproses dalam skenario demo ini. Tidak ada upload atau email nyata."
                    : "Input contoh tidak valid. Tidak ada skor, hadiah, atau rekaman peserta."}
                </p>
                <Link href="/demo/result/win" className="button button-light">
                  Lihat contoh video siap <ArrowRight size={16} />
                </Link>
              </div>
            )}
            <div className="result-privacy">
              <ShieldCheck size={17} />
              <p>
                Halaman contoh tetap. Tidak memuat nama, email, atau data
                peserta kiosk.
              </p>
            </div>
          </section>
          <section className="result-info-card">
            <span className="card-kicker">YOUR DEMO CRUNCH SCORE</span>
            <div className="score-huge">
              {s.score ?? "—"}
              {s.score !== null && <span>/100</span>}
            </div>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            <div className="result-reward">
              <b>
                {s.reward
                  ? "✦ Lay’s Good Vibes Kit"
                  : "✳ Good crunch, good times"}
              </b>
              <span>
                {s.reward
                  ? "Hadiah simulasi · Tidak dapat ditukarkan"
                  : "Tidak ada hadiah yang dialokasikan"}
              </span>
            </div>
            <SocialInstructions />
          </section>
        </div>
        <Link href="/" className="text-link center">
          Coba perjalanan demo <ArrowRight size={16} />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
