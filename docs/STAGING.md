# Persiapan staging Milestone 1

Status: **belum dideploy**. Tidak ada proyek Vercel yang ditautkan dalam repository. Persetujuan deployment dan proyek tujuan belum tersedia; akses akun Vercel tidak diperiksa/diasumsikan.

## Konfigurasi siap

- Next.js App Router, `vercel.json`, lockfile dan production build.
- Build `npm run build`; install `npm ci`; tidak mengatur output directory manual.
- Tidak memerlukan database, storage cloud, provider email, atau secret.
- Origin QR mengikuti URL aktif; override `NEXT_PUBLIC_DEMO_ORIGIN` opsional jika memakai domain staging tetap.
- Seluruh halaman mengirim `X-Robots-Tag: noindex, nofollow, noarchive` dan metadata robots.
- Rute demo bersifat publik jika deployment tidak diberi proteksi. Preview login bukan akses kontrol.

## Rekomendasi Deployment Protection

Untuk uji QR lintas ponsel, gunakan staging HTTPS sintetis tanpa proteksi hanya selama jendela pengujian yang disetujui; `noindex` tetap aktif dan tidak ada data nyata. Jika akses klien harus dibatasi, aktifkan Vercel Deployment Protection atau password protection pada project staging dan berikan kredensial secara terpisah kepada penguji. QR tidak boleh memuat password atau bypass secret. Uji rute QR, video, dan download dari ponsel setelah proteksi aktif.

## Setelah persetujuan deployment

1. Tentukan team/project Vercel tujuan dan akun yang memiliki akses; gunakan paket yang sesuai penggunaan komersial.
2. Pilih preview/staging deployment, bukan domain produksi kampanye. Jangan mengaktifkan Git integration yang menerbitkan branch tanpa workflow yang disetujui.
3. Gunakan Node LTS yang didukung dependency, usulan Node 22. Build lokal saat ini diverifikasi pada Node 25.1.0; jalankan CI Node 22 sebelum mengklaim kesetaraan runtime.
4. Tentukan apakah demo boleh diakses siapa pun yang memegang URL. Seluruh data harus tetap sintetis.
5. Jika akses dibatasi, gunakan Deployment Protection Vercel yang tersedia pada paket/project. Uji akses reviewer di komputer **dan ponsel**, termasuk rute QR dan MP4. `noindex` bukan password protection. Jangan memasukkan bypass secret ke QR atau variabel `NEXT_PUBLIC_*`.
6. Deploy hanya ke proyek dan scope yang disetujui. Catat URL HTTPS, deployment ID, commit/build, versi Node dan hasil build.
7. Uji ulang 12 layar, QR dengan ponsel fisik, playback/download, detail dashboard, CSV, reset, 404 dan aturan akses.
8. Periksa Network: seluruh asset/media dari aplikasi, tanpa Supabase/Resend atau layanan peserta nyata.

## Checklist rilis demo

- [ ] Persetujuan deployment dan project/team tujuan.
- [ ] Hak akses akun Vercel.
- [ ] Paket hosting sesuai penggunaan komersial.
- [ ] Keputusan proteksi URL.
- [ ] CI/runtime target lulus.
- [ ] URL HTTPS bekerja.
- [ ] Scan QR dari perangkat fisik.
- [ ] Download/playback dari ponsel.
- [ ] Tidak ada data peserta nyata atau secret produksi.

Milestone 1 dapat direview secara lokal sebelum semua item staging terpenuhi. Tidak ada deployment atau push yang dilakukan otomatis.
