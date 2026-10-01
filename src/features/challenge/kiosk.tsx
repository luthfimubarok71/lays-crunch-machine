"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  Headphones,
  Mic,
  ShieldCheck,
  Sparkles,
  Video,
  RotateCcw,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { useDemo } from "@/adapters/demo/provider";
import { IDENTITIES, SCENARIOS, STEPS, type ScenarioId } from "@/domain/demo";
import { Header, Footer } from "@/components/campaign/header";
import { PackArt, Waveform, Chip } from "@/components/campaign/artwork";
import { VideoPlayer } from "@/components/campaign/video-player";
import { ChallengeClock } from "./challenge-clock";
import { SocialInstructions } from "@/components/campaign/social-instructions";
import { QrPanel } from "@/components/campaign/qr-panel";

const HEADLINES = [
  "",
  "ONE CHIP.\nALL YOU.",
  "MEET OUR\nNEXT STAR.",
  "A LITTLE\nCRUNCH PREP.",
  "READY FOR\nYOUR CLOSE-UP?",
  "YOUR MOMENT\nSTARTS NOW.",
  "MAKE SOME\nCRUNCH!",
  "YOU BROUGHT\nTHE ENERGY.",
  "A LITTLE\nEXTRA JOY.",
  "YOUR MOMENT.\nTO KEEP.",
  "LET THE WORLD\nHEAR IT.",
  "THAT’S\nA WRAP!",
];
const DESCRIPTIONS = [
  "",
  "Satu gigitan. Sepuluh detik. Tunjukkan energi crunch versimu.",
  "Pilih identitas contoh untuk mencoba perjalanan peserta. Semua data di demo ini sintetis.",
  "Lihat contoh singkat dan temukan cara menikmati challenge ini.",
  "Posisikan dirimu, siapkan keripik, dan biarkan crunch jadi bintangnya.",
  "Tarik napas. Siapkan senyum. Saatnya jadi pusat perhatian.",
  "Waveform dan skor berikut adalah simulasi untuk presentasi.",
  "Setiap crunch punya ceritanya. Ini hasil simulasi momenmu.",
  "Good crunch deserves a good surprise.",
  "Simpan videonya. Putar lagi. Bagikan energinya.",
  "Momen seru selalu lebih enak kalau dibagikan.",
  "Terima kasih sudah membawa good crunch dan great energy.",
];

export function Kiosk() {
  const {
    session,
    next,
    register,
    finishCapture,
    reset,
    retry,
    chooseScenario,
    hydrated,
    storageWarning,
  } = useDemo();
  const step = session.step;
  const scenario = SCENARIOS[session.scenario];
  const [identity, setIdentity] = useState(0);
  const [consent, setConsent] = useState(false);
  const [idleWarning, setIdleWarning] = useState(false);
  const lastActivity = useRef(0);
  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);
  useEffect(() => {
    if (step === 0) {
      setConsent(false);
      setIdentity(0);
    }
    lastActivity.current = Date.now();
    setIdleWarning(false);
  }, [step]);
  useEffect(() => {
    const touch = () => {
      lastActivity.current = Date.now();
      setIdleWarning(false);
    };
    window.addEventListener("pointerdown", touch);
    window.addEventListener("keydown", touch);
    const interval = window.setInterval(() => {
      if (step === 0 || step === 5 || step === 6) return;
      const idle = Date.now() - lastActivity.current;
      if (idle >= 120000) resetRef.current();
      else if (idle >= 90000) setIdleWarning(true);
    }, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pointerdown", touch);
      window.removeEventListener("keydown", touch);
    };
  }, [step]);
  // Returning via browser history always opens a fresh participant journey.
  useEffect(() => {
    const pop = () => resetRef.current();
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  return (
    <div className="campaign-page">
      <Header />
      <main
        id="main-content"
        className={`kiosk-main ${step === 0 ? "is-landing" : ""}`}
      >
        {storageWarning && (
          <div className="notice">
            Penyimpanan sesi tidak tersedia. Demo tetap berjalan, tetapi data
            tidak bertahan saat refresh.
          </div>
        )}
        {step === 0 ? (
          <>
            <section className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <span className="tiny-star">✳</span> THE LAY’S CRUNCH CHALLENGE
              </div>
              <h1>
                BIG CRUNCH.
                <br />
                <span className="red-word">BIGGER</span>
                <br />
                ENERGY<span className="red-word">.</span>
              </h1>
              <p className="hero-description">
                Seberapa seru crunch kamu?
                <br />
                Ambil Lay’s. Siapkan senyum. Buat momenmu.
              </p>
              <button
                className="button hero-cta"
                disabled={!hydrated}
                onClick={next}
              >
                LET’S CRUNCH <ArrowUpRight size={24} />
              </button>
              <div className="hero-facts">
                <span>
                  <Clock3 size={15} /> 10 detik challenge
                </span>
                <span>
                  <Gift size={15} /> Big crunch energy
                </span>
              </div>
            </section>
            <section className="hero-art">
              <PackArt />
            </section>
            <div className="hero-bottom">
              <div className="demo-scenario">
                <label htmlFor="scenario">PRESENTATION SCENARIO</label>
                <select
                  id="scenario"
                  value={session.scenario}
                  onChange={(e) => chooseScenario(e.target.value as ScenarioId)}
                >
                  {Object.values(SCENARIOS).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <p>
                <ShieldCheck size={17} />
                <span>
                  100% demo. Identitas, skor, dan hadiah sintetis.
                  <br />
                  Kamera dan mikrofon tidak diaktifkan.
                </span>
              </p>
              <Link href="/demo/guide" className="text-link">
                Panduan demo <ArrowUpRight size={15} />
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav className="journey-progress" aria-label="Progress challenge">
              <span>THE CRUNCH JOURNEY</span>
              <div>
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    title={s}
                    className={`progress-dot ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {i < step ? <Check size={10} /> : i + 1}
                  </span>
                ))}
              </div>
              <b>{String(step + 1).padStart(2, "0")} / 12</b>
            </nav>
            <section className="stage-heading">
              <span className="eyebrow">
                <span className="tiny-star">✳</span> {STEPS[step].toUpperCase()}{" "}
                / DEMO EXPERIENCE
              </span>
              <h1>
                {HEADLINES[step].split("\n").map((line, i) => (
                  <span key={line} className={i === 1 ? "red-word" : ""}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
              <p>{DESCRIPTIONS[step]}</p>
              <div className="stage-bottom">
                <Waveform />
                <span>HOW LOUD IS YOUR CRUNCH?</span>
              </div>
            </section>
            <section
              className={`experience-card step-${step}`}
              aria-label={STEPS[step]}
            >
              {step === 1 && (
                <>
                  <span className="card-kicker">HERE’S HOW IT GOES</span>
                  <h2>
                    Small chip.
                    <br />
                    Big moment.
                  </h2>
                  <div className="instruction-list">
                    {[
                      [
                        <span key="1">01</span>,
                        "Grab your Lay’s",
                        "Siapkan keripik favoritmu.",
                      ],
                      [
                        <Mic key="2" />,
                        "Bring your best crunch",
                        "Satu tantangan seru selama 10 detik.",
                      ],
                      [
                        <Sparkles key="3" />,
                        "Keep the good vibes",
                        "Lihat skor dan bawa pulang momenmu.",
                      ],
                    ].map(([icon, title, body], i) => (
                      <div key={i}>
                        <i>{icon}</i>
                        <section>
                          <h3>{title}</h3>
                          <p>{body}</p>
                        </section>
                      </div>
                    ))}
                  </div>
                  <button className="button full" onClick={next}>
                    I’M READY <ArrowRight size={20} />
                  </button>
                </>
              )}
              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (consent) register(identity);
                  }}
                >
                  <span className="card-kicker">
                    LET’S GET TO KNOW OUR CRUNCHER
                  </span>
                  <h2>Your crunch persona.</h2>
                  <label className="field-label" htmlFor="identity">
                    Identitas sintetis
                  </label>
                  <select
                    id="identity"
                    value={identity}
                    onChange={(e) => setIdentity(Number(e.target.value))}
                  >
                    {IDENTITIES.map((p, i) => (
                      <option value={i} key={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <label className="field-label" htmlFor="name">
                    Nama contoh
                  </label>
                  <input id="name" value={IDENTITIES[identity].name} readOnly />
                  <label className="field-label" htmlFor="email">
                    Email contoh
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={IDENTITIES[identity].email}
                    readOnly
                  />
                  <p className="field-help">
                    <ShieldCheck size={14} /> Gunakan profil contoh. Demo tidak
                    meminta data pribadi.
                  </p>
                  <label className="consent">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                    <span>
                      Saya memahami ini simulasi persetujuan partisipasi. Tidak
                      ada data pribadi, rekaman nyata, atau email yang dikirim.
                    </span>
                  </label>
                  <button
                    className="button full"
                    disabled={!consent}
                    type="submit"
                  >
                    LET’S DO THIS <ArrowRight size={20} />
                  </button>
                </form>
              )}
              {step === 3 && (
                <>
                  <span className="card-kicker">YOUR 10-SECOND PLAYBOOK</span>
                  <h2>Watch. Bite. Crunch.</h2>
                  <VideoPlayer compact />
                  <p className="small-copy">
                    Video sintetis sementara. Tutorial resmi dari klien akan
                    digunakan pada tahap selanjutnya.
                  </p>
                  <div className="tip-row">
                    <Headphones size={17} />
                    <span>pause, dan replay tersedia pada player.</span>
                  </div>
                  <button className="button full" onClick={next}>
                    GOT IT, LET’S GO <ArrowRight size={20} />
                  </button>
                </>
              )}
              {step === 4 && (
                <>
                  <span className="card-kicker">YOU’RE IN THE SPOTLIGHT</span>
                  <div className="camera-simulation">
                    <span className="camera-label">
                      <i /> PREVIEW SIMULASI
                    </span>
                    <div className="camera-corners" />
                    <div className="camera-person">
                      <span>✳</span>
                      <b>
                        YOUR BEST
                        <br />
                        CRUNCH FACE.
                      </b>
                    </div>
                    <Chip className="preview-chip" />
                    <span className="camera-footer">
                      Tidak mengakses kamera perangkat
                    </span>
                  </div>
                  <div className="readiness">
                    <span>
                      <Video size={16} /> Kamera contoh{" "}
                      <CheckCircle2 size={17} />
                    </span>
                    <span>
                      <Mic size={16} /> Audio simulasi{" "}
                      <CheckCircle2 size={17} />
                    </span>
                  </div>
                  <button className="button full" onClick={next}>
                    START CHALLENGE <ArrowRight size={20} />
                  </button>
                </>
              )}
              {step === 5 && (
                <ChallengeClock
                  key="countdown"
                  mode="countdown"
                  onDone={next}
                />
              )}
              {step === 6 && (
                <ChallengeClock
                  key="recording"
                  mode="recording"
                  score={scenario.score}
                  onDone={finishCapture}
                />
              )}
              {step === 7 && (
                <>
                  <span className="card-kicker">YOUR CRUNCH SCORE IS…</span>
                  {scenario.score !== null ? (
                    <>
                      <div className="score-huge" data-testid="final-score">
                        {scenario.score}
                        <span>/100</span>
                      </div>
                      <h2 className="result-title">{scenario.title}</h2>
                      <Waveform />
                      <p>{scenario.description}</p>
                      <div className="result-meta">
                        <span>
                          <Clock3 size={15} /> 10 detik simulasi
                        </span>
                        <span>
                          <ShieldCheck size={15} /> Bukan pengukuran audio
                        </span>
                      </div>
                      <button className="button full" onClick={next}>
                        SEE MY REWARD <Gift size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="invalid-icon">
                        <AlertTriangle size={48} />
                      </div>
                      <h2>{scenario.title}</h2>
                      <p>{scenario.description}</p>
                      <button className="button full" onClick={retry}>
                        ULANGI DENGAN INPUT CONTOH <RotateCcw size={18} />
                      </button>
                      <button className="text-link center" onClick={next}>
                        Lanjut lihat alur demo <ArrowRight size={15} />
                      </button>
                    </>
                  )}
                </>
              )}
              {step === 8 && (
                <>
                  <span className="card-kicker">
                    {scenario.reward
                      ? "A CRUNCH WORTH CELEBRATING"
                      : "THE GOOD VIBES CONTINUE"}
                  </span>
                  <div
                    className={`reward-illustration ${!scenario.reward ? "no-reward" : ""}`}
                  >
                    {scenario.reward ? (
                      <Gift size={80} strokeWidth={1.5} />
                    ) : (
                      <Sparkles size={80} strokeWidth={1.5} />
                    )}
                    <span>✦</span>
                    <i>✳</i>
                  </div>
                  <h2>
                    {scenario.reward
                      ? "YOU CRUNCHED IT!"
                      : "GOOD CRUNCH.\nGOOD TIMES."}
                  </h2>
                  <p>
                    {scenario.reward
                      ? "Kamu memenuhi ambang hadiah contoh. Tidak ada hadiah asli yang dialokasikan."
                      : "Belum ada hadiah pada skenario ini. Momen serunya tetap milikmu."}
                  </p>
                  <div className="reward-ticket">
                    <span>DEMO REWARD</span>
                    <b>
                      {scenario.reward
                        ? "Lay’s Good Vibes Kit"
                        : "Thanks for crunching!"}
                    </b>
                    <small>
                      {scenario.reward
                        ? `CRUNCH-${scenario.id.toUpperCase()} · HANYA ILUSTRASI`
                        : "Bukan hasil kampanye aktif"}
                    </small>
                  </div>
                  <button className="button full" onClick={next}>
                    KEEP MY MOMENT <ArrowRight size={20} />
                  </button>
                </>
              )}
              {step === 9 && (
                <>
                  <span className="card-kicker">A LITTLE SOUVENIR</span>
                  <h2>
                    Take the crunch
                    <br />
                    with you.
                  </h2>
                  <div
                    className={`delivery-note ${scenario.video === "ready" ? "success" : ""}`}
                  >
                    {scenario.video === "ready" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock3 size={18} />
                    )}
                    <span>
                      {scenario.video === "ready"
                        ? "Video contoh siap ditonton & diunduh."
                        : scenario.video === "pending"
                          ? "Simulasi: video masih diproses. QR menampilkan status yang sama."
                          : "Simulasi invalid: tidak ada rekaman peserta yang tersedia."}
                    </span>
                  </div>
                  <QrPanel scenario={scenario.id} />
                  <p className="small-copy">
                    <Mail size={14} /> Email hanya preview. Tidak ada pengiriman
                    nyata.
                  </p>
                  <button className="button full" onClick={next}>
                    SHARE THE GOOD VIBES <ArrowRight size={20} />
                  </button>
                </>
              )}
              {step === 10 && (
                <>
                  <span className="card-kicker">GOOD VIBES TRAVEL FAST</span>
                  <h2>
                    YOUR CRUNCH.
                    <br />
                    YOUR FEED.
                  </h2>
                  <SocialInstructions />
                  <button className="button full" onClick={next}>
                    ALL DONE <Check size={20} />
                  </button>
                </>
              )}
              {step === 11 && (
                <>
                  <span className="finish-star">✳</span>
                  <span className="card-kicker">
                    GOOD CRUNCH. BRIGHTER DAYS.
                  </span>
                  <h2>
                    THANKS FOR
                    <br />
                    CRUNCHING!
                  </h2>
                  <p>
                    Momen kecil. Energi besar.
                    <br />
                    Sampai jumpa di crunch berikutnya.
                  </p>
                  <button className="button full" onClick={reset}>
                    FINISH & RESET <ArrowRight size={20} />
                  </button>
                  <Link
                    href="/demo/admin"
                    className="text-link center"
                    onClick={reset}
                  >
                    Lihat peserta demo di dashboard <ArrowUpRight size={16} />
                  </Link>
                </>
              )}
              <span className="card-demo-label">
                DEMONSTRATION ONLY · NO REAL PRIZES
              </span>
            </section>
          </>
        )}
      </main>
      <Footer />
      {idleWarning && (
        <div className="modal-backdrop">
          <section
            className="idle-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="idle-title"
          >
            <Clock3 />
            <h2 id="idle-title">Masih di sini?</h2>
            <p>Demo akan kembali ke awal setelah 30 detik tanpa interaksi.</p>
            <button
              className="button"
              onClick={() => {
                lastActivity.current = Date.now();
                setIdleWarning(false);
              }}
            >
              Lanjutkan demo
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
