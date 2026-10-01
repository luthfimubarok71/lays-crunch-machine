import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";
// Original synthetic typography clip. No third-party footage or personal data.
const target = path.resolve("public/demo");
await fs.mkdir(target, { recursive: true });
const bars = Array.from({ length: 39 }, (_, i) => {
  const h = 20 + Math.abs(Math.sin(i * 0.79) * Math.cos(i * 0.23)) * 160;
  return `<rect x="${100 + i * 13}" y="${805 - h / 2}" width="7" height="${h}" rx="3" fill="${i % 3 ? "#db231c" : "#202019"}"/>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><rect width="720" height="1280" fill="#ffe329"/><circle cx="360" cy="525" r="285" fill="none" stroke="#d7bd27" stroke-width="2"/><circle cx="360" cy="525" r="245" fill="none" stroke="#d7bd27" stroke-width="1" stroke-dasharray="6 7"/><rect x="235" y="85" rx="25" width="250" height="48" fill="#202019"/><text x="360" y="116" font-family="Arial" font-size="17" text-anchor="middle" fill="#ffe329" letter-spacing="3">DEMO / SAMPLE FILM</text><g text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="108"><text x="360" y="385" fill="#202019">SMALL CHIP.</text><text x="360" y="509" fill="#db231c">BIG</text><text x="360" y="635" fill="#db231c">ENERGY.</text></g><text x="360" y="706" font-family="Arial" text-anchor="middle" font-size="16" letter-spacing="4" fill="#202019">YOUR CRUNCH. YOUR MOMENT.</text>${bars}<rect x="180" y="944" width="360" height="85" rx="10" fill="#db231c"/><text x="360" y="994" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">LET'S CRUNCH</text><text x="360" y="1120" font-family="Arial" font-size="15" text-anchor="middle" fill="#5f571f">VIDEO SINTETIS - BUKAN REKAMAN PESERTA</text><text x="360" y="1150" font-family="Arial" font-size="13" text-anchor="middle" fill="#5f571f">10 SECONDS / PROVISIONAL CREATIVE</text></svg>`;
const png = path.join(target, "source.png");
await sharp(Buffer.from(svg)).png().toFile(png);
await sharp(Buffer.from(svg))
  .webp({ quality: 90 })
  .toFile(path.join(target, "crunch-poster.webp"));
const result = spawnSync(
  ffmpeg,
  [
    "-y",
    "-loop",
    "1",
    "-i",
    png,
    "-f",
    "lavfi",
    "-i",
    "anullsrc=r=48000:cl=mono",
    "-vf",
    "zoompan=z='1+0.00012*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=30",
    "-t",
    "10",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "24",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "64k",
    "-movflags",
    "+faststart",
    path.join(target, "crunch-sample.mp4"),
  ],
  { encoding: "utf8" },
);
if (result.status !== 0) throw new Error(result.stderr);
await fs.unlink(png);
console.log("Generated original 10-second synthetic MP4 and WebP poster.");
