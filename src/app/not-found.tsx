import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty-page">
      <p className="eyebrow">404 / WRONG CRUNCH</p>
      <h1>Halaman tidak ditemukan.</h1>
      <p>Tautan demo ini tidak tersedia.</p>
      <Link className="button" href="/">
        Kembali ke demo
      </Link>
    </main>
  );
}
