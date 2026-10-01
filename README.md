# Lay’s Crunch Machine

Milestone 1: interactive client demo. Next.js App Router, React, TypeScript, Tailwind CSS.

Seluruh identitas, waveform, skor, hadiah, status video, dan email merupakan **simulasi**. Aplikasi tidak memakai kamera/mikrofon atau terhubung ke layanan produksi. Ilustrasi merek/kemasan, video, dan materi kampanye merupakan aset provisional.

## Menjalankan

Gunakan Node.js 22+ dan npm. Di PowerShell gunakan `npm.cmd` jika `npm.ps1` diblokir.

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000`. Untuk memeriksa production build:

```sh
npm run build
npm run start
```

Server development/start mendengarkan pada `0.0.0.0` agar bisa diakses melalui alamat LAN. Ini tidak membuat URL publik atau deployment.

## Rute utama

| Rute                            | Isi                                            |
| ------------------------------- | ---------------------------------------------- |
| `/`                             | 12 layar peserta; pilihan skenario di landing  |
| `/demo/admin`                   | Overview dashboard                             |
| `/demo/admin/participants`      | Tabel, filter, pagination, CSV                 |
| `/demo/admin/participants/[id]` | Detail dan sample video                        |
| `/demo/admin/videos`            | Video monitoring                               |
| `/demo/admin/rewards`           | Reward monitoring                              |
| `/demo/admin/emails`            | Email monitoring                               |
| `/demo/admin/email-preview`     | Preview template, tidak mengirim email         |
| `/demo/login`                   | Preview login; bukan autentikasi               |
| `/demo/result/win`              | Hasil contoh 92, hadiah simulasi, video siap   |
| `/demo/result/no-win`           | Hasil contoh 64, belum menang                  |
| `/demo/result/pending`          | Hasil contoh 88, video pending                 |
| `/demo/result/invalid`          | Input invalid, tanpa skor/hadiah/video peserta |
| `/demo/guide`                   | Panduan presentasi                             |

## Data dan batas demo

- Pendaftaran memilih salah satu dari empat identitas sintetis. Nama/email tidak menerima data pengunjung.
- Riwayat peserta tersimpan di `sessionStorage`, maksimal 50 record. Dashboard dan kiosk berbagi repository pada tab yang sama; bukan sinkronisasi antarperangkat/tab.
- Refresh mempertahankan riwayat sintetis dan mengembalikan perjalanan aktif ke landing. Finish membersihkan peserta aktif, bukan riwayat dashboard.
- Pengguna berikutnya tidak memperoleh identitas peserta sebelumnya di kiosk.
- QR mengarah ke skenario tetap, tidak membawa identitas/ID registrasi. Di perangkat lain skenario tetap berfungsi tanpa database.
- Input invalid bisa diulang menjadi skenario sukses tanpa membuat registrasi baru.
- Tidak tersedia admin create participant, edit score, ganti video, atau klaim hadiah.
- `Permissions-Policy` menonaktifkan kamera/mikrofon/geolocation pada milestone ini. Header tersebut harus diubah secara sengaja saat Milestone 2.
- Semua halaman `noindex`; hal itu **bukan** perlindungan akses. Demo dashboard terbuka dan hanya berisi data sintetis.

## QR lintas perangkat

Untuk ponsel, buka kiosk melalui `http://<IP-LAN-komputer>:3000` pada jaringan yang sama, atau URL HTTPS staging setelah disetujui. QR mengikuti origin tersebut. `localhost`, seluruh `127.*`, dan loopback IPv6 ditolak karena tidak dapat dipakai ponsel lain.

Opsional: isi `NEXT_PUBLIC_DEMO_ORIGIN` dalam `.env.local` dengan origin yang benar-benar dapat dijangkau, kemudian build ulang. Nilai ini bukan rahasia. Jangan isi URL yang belum tersedia. Tidak ada tunneling atau perubahan firewall otomatis.

Pengujian QR otomatis menggunakan origin domain uji yang diarahkan ke server lokal dan browser context ponsel terpisah. Pengujian itu bukan bukti scan kamera ponsel fisik.

## Validasi

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

E2E menjalankan production server port 3000 atau menggunakan server yang sudah tersedia. Pastikan server tersebut memakai build terbaru. Test menghasilkan screenshot di `docs/screenshots/`, HTML report di `playwright-report/`, dan trace jika gagal di `test-results/`.

CI disiapkan untuk pull request/manual dispatch. CI belum dianggap lulus sampai workflow benar-benar dijalankan di GitHub. Tidak ada workflow deployment.

## Sample video

MP4 H.264/AAC 720×1280, 30 fps, 10 detik. Video tipografi sintetis dengan gerakan zoom dan audio senyap; bukan rekaman orang atau tutorial final. File disertakan sehingga runtime tidak membutuhkan FFmpeg.

```sh
npm run media:generate
```

Script menghasilkan video/poster original menggunakan Sharp dan FFmpeg khusus pengembangan. Font lokal berasal dari paket Fontsource; tidak ada permintaan Google Fonts saat aplikasi berjalan.

## Arsitektur

- `domain`: skenario, tipe, state machine, validasi data sesi, CSV, dan aturan URL QR.
- `adapters/demo`: fixture dan provider repository sesi.
- `components/campaign`: artwork vector/CSS, brand, video, header, QR.
- `features/challenge`: orkestrasi 12 layar dan timer simulasi.
- `features/admin`: dashboard dan queries/filter data sintetis.
- `features/delivery`: hasil publik berbasis fixture.
- `domain/contracts.ts`: port untuk integrasi capture/delivery berikutnya, tanpa implementasi Live.

Tidak ada Supabase, API produksi, secret server, atau SDK Android pada milestone ini.

Lihat [panduan staging](docs/STAGING.md), [checklist demo](docs/DEMO-CHECKLIST.md), dan [laporan milestone](docs/MILESTONE-1.md).
