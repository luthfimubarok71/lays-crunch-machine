# Laporan Milestone 1 — Interactive Client Demo

Tanggal laporan: **2 Oktober 2026 (Asia/Jakarta)**.

**Status: implementasi demo selesai dan diuji secara lokal. Staging publik serta penerimaan perangkat fisik masih tertunda.** Milestone 2 belum dimulai. Tidak ada push, commit, provisioning layanan, atau deployment yang dilakukan.

## Fitur selesai

| Area                | Hasil                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Foundation          | Next.js App Router, React, TypeScript strict, Tailwind, komponen modular, kontrak adapter, lockfile dan CI config       |
| Kiosk               | 12 layar: landing, welcome, registrasi, tutorial, persiapan, countdown, challenge, hasil, reward, video, sosial, finish |
| Interaksi           | Navigasi, validasi consent, identitas contoh, perlindungan klik ganda, countdown, challenge 10 detik, retry invalid     |
| Skenario            | Menang 92, belum menang 64, pending 88, invalid tanpa skor/hadiah                                                       |
| Dashboard           | Overview, peserta otomatis dari sesi kiosk, detail, pencarian, filter status/tanggal WIB, sorting, pagination, CSV      |
| Monitoring          | Video library, reward, email status, preview template email dan preview login                                           |
| Video               | MP4 sintetis 10 detik; playback, pause, replay, dan download                                                            |
| QR                  | PNG QR sungguhan; menuju halaman skenario tetap yang dapat dibuka tanpa database atau data sesi kiosk                   |
| Halaman ponsel      | Skor, video/download, pending/invalid state, caption dan petunjuk kampanye                                              |
| Reset               | Finish, reset manual, inactivity warning/reset, cleanup identitas aktif, aman saat kembali melalui browser Back         |
| Isolasi             | Data sintetis dalam sessionStorage; tanpa Supabase, email provider, hadiah, camera/microphone API                       |
| Staging preparation | Vercel config, noindex, header kebijakan browser, dokumentasi akses dan checklist deployment                            |

Seluruh navigasi dashboard bersifat monitoring. Tidak ada tombol membuat peserta, mengedit skor, mengganti video, atau mengklaim hadiah.

## Fitur yang masih disimulasikan

- Kamera, mikrofon, waveform, skor, hadiah dan status delivery.
- Email delivered/pending adalah status contoh; tidak ada email dikirim.
- Login merupakan preview visual, bukan autentikasi atau access protection.
- Consent adalah contoh interaksi, bukan consent untuk pengumpulan data produksi.
- Video menggunakan animasi tipografi original dengan audio senyap, bukan rekaman orang. Tutorial/brand kit resmi belum tersedia.
- Halaman QR menunjukkan skenario yang sama, tetapi tidak membawa identitas atau rekaman unik dari pendaftar kiosk.
- Caption, hashtag, hadiah dan ketentuan promosi merupakan materi provisional.

## Hasil pengujian

| Pemeriksaan           | Hasil dan batas                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ESLint                | Lulus tanpa error/warning aplikasi                                                                                              |
| TypeScript            | Lulus; script menghasilkan route types sebelum pemeriksaan                                                                      |
| Unit tests            | **8/8 lulus**: transisi/klik ganda, registrasi/reset, scenario lock/retry, fixture, sanitasi sesi, CSV, URL QR                  |
| Production build      | Lulus pada Next.js 16.3.8, React 19.3.0, Node 25.1.0 di Windows                                                                 |
| Browser E2E           | **11/11 lulus**, Chromium Playwright; suite sekitar 2,3 menit                                                                   |
| Tantangan             | Durasi simulasi 10 detik diuji dalam perjalanan nyata browser; finalisasi sekali setelah countdown                              |
| MP4                   | Metadata sekitar 10 detik, video benar-benar dimainkan, dipause, diulang dan diunduh                                            |
| Dashboard             | Registrasi muncul, detail dapat dibuka, pencarian/filter dan isi CSV diperiksa                                                  |
| QR                    | Gambar QR didekode dengan jsQR, URL diperiksa, lalu dibuka dalam context ponsel terpisah tanpa data registrasi                  |
| Privacy/reset         | Data aktif tidak dipulihkan melalui Back; inactivity reset bekerja; corrupt session data ditangani                              |
| Isolasi jaringan      | Perjalanan lengkap tidak melakukan request layanan eksternal/produksi                                                           |
| Responsive            | Desktop 1440×1000, tablet 768×1024 dan 1366×768, ponsel 390×844 dan 360×800                                                     |
| Unknown route         | Skenario tak dikenal memberikan halaman tidak ditemukan dan HTTP 404                                                            |
| GitHub CI             | Workflow disiapkan, **belum dijalankan di GitHub**                                                                              |
| Safari/WebKit/Firefox | **Belum diuji**                                                                                                                 |
| QR/scan ponsel fisik  | **Belum diuji**; browser mobile emulation tidak menggantikan perangkat fisik                                                    |
| LAN                   | Permintaan ke alamat LAN dari lingkungan eksekusi gagal; localhost berfungsi. Akses jaringan antarperangkat belum terverifikasi |
| Vercel HTTPS          | **Belum dideploy dan belum diuji**                                                                                              |

Kegagalan pada putaran E2E awal disebabkan tes melakukan refresh sebelum navigasi client selesai. Tes telah diperbaiki dengan menunggu URL tujuan; suite berikutnya lulus. Penanganan route invalid juga diperbaiki agar mengembalikan 404 tanpa error internal fallback.

Setelah koreksi CSS terakhir, production build, lint, typecheck dan 8 unit test kembali lulus. Tiga uji browser yang relevan (perjalanan lengkap, responsive/dashboard, dan kontrol tablet/ponsel) dijalankan ulang: **3/3 lulus**. Laporan subset ini tersedia di `playwright-report/visual/index.html`; laporan suite lengkap 11/11 tetap berada di `playwright-report/index.html`.

## Bukti visual

Screenshot berikut dihasilkan dari browser yang menjalankan build aplikasi:

- [Landing desktop](screenshots/landing-desktop.png)
- [Landing tablet](screenshots/landing-tablet.png)
- [Landing mobile](screenshots/landing-mobile.png)
- [Dashboard](screenshots/dashboard.png)
- [Dashboard mobile](screenshots/dashboard-mobile.png)
- [Persiapan kamera simulasi](screenshots/camera-preparation.png)
- [Hasil challenge](screenshots/challenge-result.png)
- [Halaman hasil mobile](screenshots/result-mobile.png)
- [Persiapan tablet portrait](screenshots/preparation-tablet-portrait.png)
- [Persiapan tablet landscape](screenshots/preparation-tablet-landscape.png)
- [Persiapan ponsel](screenshots/preparation-phone.png)

Landing, dashboard, hasil, dan layar persiapan diperiksa secara visual. Koreksi terakhir memindahkan ilustrasi keripik pada preview agar tidak menutupi teks.

HTML report lokal berada di `playwright-report/index.html`; dapat dihasilkan ulang dengan `npm run test:e2e`. Report dan trace adalah build/test artifacts, tidak dimasukkan sebagai source. Screenshot presentasi disimpan di repository.

## Status deployment dan blocker

**Belum ada URL HTTPS publik.** Repository belum ditautkan ke proyek Vercel. Akses akun tidak diasumsikan dan tidak ada deployment yang dijalankan.

Yang dibutuhkan untuk melanjutkan staging:

1. Proyek/team Vercel tujuan, akses akun, dan persetujuan deployment.
2. Keputusan apakah URL demo boleh publik atau memerlukan Deployment Protection.
3. Pengujian QR dan MP4 dari ponsel fisik setelah URL tersedia.

Konfigurasi tidak memerlukan Supabase atau layanan produksi lain. Ikuti [panduan staging](STAGING.md). `noindex` bukan akses kontrol; jika akses dibatasi, gunakan protection Vercel dan uji seluruh rute hasil/media dari perangkat reviewer.

## Batas dan known issues

- Riwayat sintetis dibagikan antara kiosk/dashboard pada **tab yang sama**; tidak disinkronkan antar-tab/perangkat. Tutup sesi browser dapat menghapus data.
- Autentikasi asli, persistence server, audio scoring nyata dan hardware acceptance belum termasuk milestone ini.
- Aset kampanye final masih menunggu klien; video saat ini adalah placeholder sintetis.
- Regenerasi video memakai FFmpeg development dependency. Runtime/demo yang sudah dibuild tidak memerlukannya.
- Dukungan lintas browser, LAN, dan perangkat acara belum boleh dinyatakan lulus berdasarkan tes Chromium lokal.

## Pekerjaan Milestone 2 — belum dimulai

- Browser media adapter untuk permission, preview kamera, dan input mikrofon.
- Capture video/audio nyata menggunakan stream yang sama untuk analisis.
- AudioWorklet, waveform nyata, pengukuran relatif dan Crunch Score provisional.
- Verifikasi durasi output, playback rekaman asli, serta error/resource cleanup.
- Pengujian pada perangkat pengembangan sebelum integrasi hardware vendor.

Pekerjaan berhenti pada Milestone 1 untuk review dan persetujuan berikutnya.
