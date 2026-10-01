import Link from "next/link";
import { Header, Footer } from "@/components/campaign/header";
export default function Page() {
  return (
    <div className="campaign-page">
      <Header />
      <main className="guide-page">
        <span className="eyebrow">THE DEMO PLAYBOOK</span>
        <h1>
          LET’S MAKE
          <br />
          SOME CRUNCH.
        </h1>
        <div className="guide-grid">
          <section>
            <h2>Presentasi dalam 5 langkah</h2>
            <ol>
              <li>
                Pilih skenario di landing: menang, belum menang, invalid, atau
                video pending.
              </li>
              <li>
                Jalankan 12 layar. Pilih identitas sintetis, setujui consent
                contoh, lalu tunggu countdown dan tantangan 10 detik.
              </li>
              <li>
                Pindai QR dari ponsel. Gunakan alamat LAN atau HTTPS staging;
                localhost tidak dapat diakses ponsel.
              </li>
              <li>
                Klik Finish, buka dashboard, lalu cari identitas demo yang baru
                didaftarkan.
              </li>
              <li>
                Tunjukkan detail, sample video, status email, dan export CSV.
              </li>
            </ol>
            <Link className="button" href="/">
              Mulai demo →
            </Link>
          </section>
          <section>
            <h2>Yang perlu diketahui</h2>
            <p>
              Semua skor, hadiah, waveform, status email, dan identitas adalah
              simulasi. Aplikasi tidak menggunakan kamera/mikrofon atau mengirim
              email.
            </p>
            <p>
              Ilustrasi kemasan, tipografi, video, dan copy merupakan aset
              provisional, bukan materi kampanye yang sudah disetujui.
            </p>
            <p>
              Data dashboard disimpan hanya dalam sesi tab browser. QR membuka
              skenario sintetis tetap, tanpa membawa data registrasi.
            </p>
            <p>
              Perangkat acara dan kalibrasi akustik belum diuji. Demo ini
              merupakan Milestone 1.
            </p>
            <Link href="/demo/admin" className="text-link">
              Buka dashboard →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
