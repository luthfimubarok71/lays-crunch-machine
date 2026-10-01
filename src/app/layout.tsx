import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "./globals.css";
import { DemoProvider } from "@/adapters/demo/provider";
export const metadata: Metadata = {
  title: "Lay’s Crunch Machine — Interactive Demo",
  description:
    "Demo interaktif Lay’s Crunch Machine. Semua identitas, skor, dan hadiah adalah simulasi.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
