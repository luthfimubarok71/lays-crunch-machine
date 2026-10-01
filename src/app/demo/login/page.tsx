import Link from "next/link";
import { Brand } from "@/components/campaign/artwork";
export default function Page() {
  return (
    <main className="login-page">
      <div className="login-card">
        <Brand />
        <span className="eyebrow">ADMIN LOGIN / VISUAL PREVIEW</span>
        <h1>
          Welcome to
          <br />
          the good vibes.
        </h1>
        <p>
          Dashboard ini berisi data sintetis dan tidak memerlukan akun.
          Autentikasi produksi belum diimplementasikan.
        </p>
        <label className="field-label" htmlFor="preview-email">
          Akun contoh
        </label>
        <input id="preview-email" value="client@example.com" readOnly />
        <Link className="button full" href="/demo/admin">
          Masuk dashboard demo →
        </Link>
        <Link href="/" className="text-link center">
          Kembali ke kiosk
        </Link>
      </div>
    </main>
  );
}
