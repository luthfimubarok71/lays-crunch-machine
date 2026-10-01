import Link from "next/link";
import { Brand } from "@/components/campaign/artwork";
import { IDENTITIES, SCENARIOS, isScenario } from "@/domain/demo";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string; identity?: string }>;
}) {
  const params = await searchParams;
  const s = SCENARIOS[isScenario(params.scenario) ? params.scenario : "win"];
  const i = Number(params.identity ?? 0);
  const identity =
    IDENTITIES[Number.isInteger(i) && i >= 0 && i < IDENTITIES.length ? i : 0];
  return (
    <>
      <div className="admin-title">
        <div>
          <span className="eyebrow">EMAIL TEMPLATE / PREVIEW ONLY</span>
          <h1>A little joy in your inbox.</h1>
          <p>
            Tidak ada email yang dikirim. Konten kampanye masih provisional.
          </p>
        </div>
      </div>
      <div className="email-envelope">
        <div className="email-meta">
          <p>
            <b>To:</b> {identity.email} (sintetis)
          </p>
          <p>
            <b>Subject:</b> Your Lay’s Crunch Moment Is Ready!
          </p>
          <p>
            <b>Status:</b> {s.email} · simulasi
          </p>
        </div>
        <div className="email-body">
          <Brand />
          <span className="eyebrow">HEY, {identity.name.toUpperCase()}!</span>
          <h2>
            YOU BROUGHT
            <br />
            THE CRUNCH.
          </h2>
          <p>Terima kasih sudah membawa energi seru ke Lay’s Crunch Machine.</p>
          <div className="email-score">
            {s.score ?? "—"}
            <span>DEMO CRUNCH SCORE</span>
          </div>
          {s.video === "ready" ? (
            <Link href={`/demo/result/${s.id}`} className="button">
              Lihat video contoh →
            </Link>
          ) : (
            <p>
              {s.video === "pending"
                ? "Email akan dijadwalkan setelah video siap pada implementasi Live."
                : "Challenge invalid tidak memicu email hasil."}
            </p>
          )}
          <p>
            Simpan momenmu dan bagikan good vibes.
            <br />
            #LaysCrunchChallenge — hashtag contoh.
          </p>
          <small>
            Preview template · Bukan promosi aktif.
            <br />
            Hadiah, periode, mention, dan syarat kampanye menunggu persetujuan
            klien.
          </small>
        </div>
      </div>
    </>
  );
}
