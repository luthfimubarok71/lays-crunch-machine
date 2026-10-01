"use client";
import { useState } from "react";
import { Copy } from "lucide-react";
export function SocialInstructions() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const caption =
    "My crunch. My moment. ✨ #LaysCrunchChallenge — caption contoh, bukan kampanye aktif.";
  async function copy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <div className="social-instructions">
      <ol>
        <li>
          <span>01</span>
          <div>
            <b>Simpan video contoh</b>
            <p>Unduh dari halaman hasil di ponselmu.</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <b>Buka Instagram</b>
            <p>Pilih video untuk Reel atau Story.</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <b>Tambahkan caption</b>
            <p>
              Hashtag, mention, dan hadiah tambahan menunggu persetujuan klien.
            </p>
          </div>
        </li>
      </ol>
      <div className="caption-box">
        <span>CAPTION PREVIEW</span>
        <p>{caption}</p>
        <button className="text-link" onClick={copy}>
          <Copy size={15} />
          {copied ? "Caption tersalin" : "Salin caption contoh"}
        </button>
        {copyError && (
          <p role="status">
            Clipboard tidak tersedia. Pilih teks caption di atas untuk menyalin.
          </p>
        )}
      </div>
      <p className="small-copy">
        Demo tidak mempublikasikan atau memverifikasi posting sosial.
      </p>
    </div>
  );
}
