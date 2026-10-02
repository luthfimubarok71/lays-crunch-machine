# Laporan Milestone 1.6 — Vercel Staging

Status: **deployed dan protected**.

## Konfigurasi

- Project: `lays-crunch-machine-staging`
- Team: `luthfimubarok71-8145s-projects` (Hobby)
- Branch: `staging/lays-crunch-machine`
- Commit deployment: `ea9c010`
- Framework: Next.js
- Node.js: `22.x`
- Install: `npm ci`
- Build: `npm run build`
- Data: synthetic demo saja
- Supabase/Resend: tidak digunakan

## URL

- Preview staging: https://lays-crunch-machine-staging-it57nvv3x.vercel.app
- Deployment inspector: https://vercel.com/luthfimubarok71-8145s-projects/lays-crunch-machine-staging/J5F5anzpygBk5XyG7iMYnUswFCyT
- Dashboard demo: https://lays-crunch-machine-staging-it57nvv3x.vercel.app/demo/admin
- Skenario QR: `/demo/result/win`, `/demo/result/no-win`, `/demo/result/invalid`, `/demo/result/pending`

## Proteksi

Vercel Authentication aktif dengan Standard Protection. Akses tanpa autentikasi ditolak. Client reviewer harus diberi akses melalui akun Vercel atau Shareable Link dari dashboard Vercel. Password, token bypass, dan credential tidak dimasukkan ke QR atau URL publik.

## Verifikasi deployment

- Build Vercel: berhasil.
- `npm ci` pada Linux Vercel: berhasil setelah lockfile diperbaiki.
- Deployment state: `READY`.
- Deployment protection: `vercel_authentication`.
- Smoke request tanpa autentikasi: ditolak oleh proteksi Vercel.
- Smoke request melalui `vercel curl`: proteksi terdeteksi dan meminta bypass token CLI.
- Pengujian fisik smartphone belum dilakukan dari lingkungan development.

## Limitasi yang masih disimulasikan

Camera capture, microphone/audio scoring, Crunch Score, reward allocation, email delivery, dan social publishing masih berupa demo sintetis. Login admin di dalam aplikasi bukan autentikasi produksi.

## Rollback

Rollback dilakukan dari Vercel Dashboard dengan mempromosikan deployment READY sebelumnya. Jangan menjalankan `vercel deploy --prod` untuk milestone ini. Deployment staging dapat dihapus dari project Vercel setelah review selesai.

## Checklist review klien

- [ ] Reviewer membuka URL melalui Vercel Authentication atau Shareable Link.
- [ ] Menyelesaikan 12 layar participant journey.
- [ ] Menguji empat skenario hasil.
- [ ] Membuka dashboard dan detail participant.
- [ ] Memutar dan mengunduh sample video.
- [ ] Scan QR pada smartphone yang sudah diotorisasi.
- [ ] Memeriksa halaman hasil mobile dan reset session.
- [ ] Memastikan seluruh data tetap sintetis.

Milestone 2 belum dimulai.
