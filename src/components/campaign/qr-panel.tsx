"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { useDemo } from "@/adapters/demo/provider";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { resultUrl, type ScenarioId } from "@/domain/demo";
export function QrPanel({ scenario }: { scenario: ScenarioId }) {
  const { reset } = useDemo();
  const [qr, setQr] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    const target = resultUrl(
      process.env.NEXT_PUBLIC_DEMO_ORIGIN || window.location.origin,
      scenario,
    );
    setUrl(target);
    setQr("");
    setError(false);
    if (target)
      QRCode.toDataURL(target, {
        width: 240,
        margin: 3,
        errorCorrectionLevel: "M",
        color: { dark: "#191917", light: "#ffffff" },
      })
        .then((data) => {
          if (live) setQr(data);
        })
        .catch(() => {
          if (live) setError(true);
        });
    return () => {
      live = false;
    };
  }, [scenario]);
  return (
    <div className="qr-panel">
      {qr ? (
        <img
          data-testid="result-qr"
          src={qr}
          width={184}
          height={184}
          alt="QR halaman hasil demo sintetis"
        />
      ) : (
        <div className="qr-placeholder">
          <Smartphone size={32} />
          <p>
            {url
              ? error
                ? "QR gagal dibuat. Gunakan tautan di bawah."
                : "Menyiapkan QR…"
              : "Buka demo melalui IP LAN atau URL staging untuk membuat QR yang bisa dipindai ponsel."}
          </p>
        </div>
      )}
      <div>
        <span className="eyebrow">TAKE YOUR MOMENT HOME</span>
        <h3>Scan. Save. Share.</h3>
        <p>Halaman contoh tanpa data pribadi. Tidak memerlukan login.</p>
        <Link
          href={`/demo/result/${scenario}`}
          className="text-link"
          onClick={reset}
        >
          Buka halaman hasil <ArrowUpRight size={16} />
        </Link>
        {url && <p className="qr-origin">{new URL(url).host}</p>}
      </div>
    </div>
  );
}
