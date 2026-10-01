"use client";
import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Brand } from "./artwork";
import { useDemo } from "@/adapters/demo/provider";
export function Header({ result = false }: { result?: boolean }) {
  const { reset } = useDemo();
  return (
    <header className="site-header">
      <Link href="/" onClick={reset} className="brand-link">
        <Brand />
      </Link>
      <div className="header-tools">
        <span className="demo-pill">
          <i /> INTERACTIVE DEMO
        </span>
        {!result && (
          <>
            <button
              className="icon-button header-reset"
              onClick={reset}
              aria-label="Reset sesi"
            >
              <RotateCcw size={18} />
            </button>
            <Link className="dashboard-link" href="/demo/admin" onClick={reset}>
              Dashboard <ArrowUpRight size={16} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <span>GOOD CRUNCH. BRIGHTER DAYS.</span>
      <span>Concept demo · Aset provisional · Bukan kampanye aktif</span>
      <span>LAY’S CRUNCH MACHINE © 2026</span>
    </footer>
  );
}
