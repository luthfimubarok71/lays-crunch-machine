"use client";
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Film,
  Gift,
  LayoutDashboard,
  Mail,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useDemo } from "@/adapters/demo/provider";
import { IDENTITIES, SCENARIOS, participantsCsv } from "@/domain/demo";
import { Brand, Waveform } from "@/components/campaign/artwork";
import { VideoPlayer } from "@/components/campaign/video-player";
const NAV = [
  { href: "/demo/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/demo/admin/participants", label: "Peserta", icon: Users },
  { href: "/demo/admin/videos", label: "Video library", icon: Film },
  { href: "/demo/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/demo/admin/emails", label: "Email delivery", icon: Mail },
];
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { reset, storageWarning } = useDemo();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" onClick={reset}>
          <Brand small />
        </Link>
        <span className="sidebar-section">EVENT WORKSPACE</span>
        <nav aria-label="Dashboard">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={
                (href === "/demo/admin" ? path === href : path.startsWith(href))
                  ? "active"
                  : ""
              }
            >
              <Icon size={19} />
              {label}
              {(href === "/demo/admin"
                ? path === href
                : path.startsWith(href)) && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-demo">
            <ShieldCheck size={19} />
            <b>Demo workspace</b>
            <p>
              Seluruh data sintetis.
              <br />
              Monitoring tanpa perubahan data.
            </p>
          </div>
          <Link href="/" onClick={reset}>
            <ArrowLeft size={16} /> Kembali ke kiosk
          </Link>
          <Link href="/demo/login">
            Preview login <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="event-dot" /> Lay’s Crunch Machine{" "}
            <span className="admin-divider">/</span> <span>Client demo</span>
          </div>
          <span className="admin-user">
            <span>CL</span> Client preview
          </span>
        </header>
        <div className="admin-content">
          {storageWarning && (
            <p className="notice">
              Penyimpanan browser tidak tersedia; data hanya bertahan selama
              halaman terbuka.
            </p>
          )}
          <div className="admin-demo-strip">
            <span className="demo-pill">
              <i /> DEMO MODE
            </span>
            <span>Data sintetis · Tidak terhubung ke layanan produksi</span>
            <Link href="/demo/guide">
              Panduan <ArrowUpRight size={13} />
            </Link>
          </div>
          {children}
        </div>
        <footer className="admin-footer">
          LAY’S CRUNCH MACHINE <span>Client preview · Milestone 01</span>
        </footer>
      </div>
    </div>
  );
}
export function StatusBadge({
  children,
  kind = "neutral",
}: {
  children: ReactNode;
  kind?: "success" | "warning" | "neutral" | "danger";
}) {
  return (
    <span className={`status-badge status-${kind}`}>
      <i />
      {children}
    </span>
  );
}
function time(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
export function Overview() {
  const { rows } = useDemo();
  const complete = rows.filter((p) => p.status === "completed");
  const winners = complete.filter((p) => SCENARIOS[p.scenario].reward);
  const scores = complete.map((p) => SCENARIOS[p.scenario].score ?? 0);
  return (
    <>
      <div className="admin-title">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h1>A little crunch. A lot of energy.</h1>
          <p>Semua momen, peserta, dan good vibes dalam satu tempat.</p>
        </div>
        <span className="date-chip">Synthetic session</span>
      </div>
      <section className="stats-grid">
        {[
          [Users, "Total peserta", rows.length, "Registrasi demo"],
          [
            CheckCircle2,
            "Challenge selesai",
            complete.length,
            `${rows.length - complete.length} belum selesai / invalid`,
          ],
          [Gift, "Demo winners", winners.length, "Hadiah ilustrasi"],
          [
            Volume2,
            "Rata-rata score",
            scores.length
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : "—",
            "Dari hasil valid saja",
          ],
        ].map(([Icon, label, value, note], i) => {
          const I = Icon as typeof Users;
          return (
            <article className={`stat-card stat-${i}`} key={i}>
              <div>
                <span>{String(label)}</span>
                <I size={20} />
              </div>
              <strong>
                {String(value)}
                {i === 3 && <small>/100</small>}
              </strong>
              <p>{String(note)}</p>
            </article>
          );
        })}
      </section>
      <section className="overview-middle">
        <article className="energy-banner">
          <div>
            <span className="eyebrow">THE CRUNCH COLLECTIVE</span>
            <h2>
              GOOD CRUNCH.
              <br />
              GREAT MOMENTS.
            </h2>
            <p>
              Skor tertinggi demo{" "}
              <b>{scores.length ? Math.max(...scores) : "—"}</b> / 100
            </p>
          </div>
          <Waveform />
          <span className="energy-star">✳</span>
        </article>
        <article className="pipeline-card">
          <div className="section-title">
            <h2>Delivery snapshot</h2>
            <span>SIMULASI</span>
          </div>
          <div>
            <Film size={18} />
            <span>Video siap</span>
            <b>
              {
                complete.filter((p) => SCENARIOS[p.scenario].video === "ready")
                  .length
              }
            </b>
          </div>
          <div>
            <SlidersHorizontal size={18} />
            <span>Video pending</span>
            <b>
              {
                complete.filter(
                  (p) => SCENARIOS[p.scenario].video === "pending",
                ).length
              }
            </b>
          </div>
          <div>
            <Mail size={18} />
            <span>Email delivered contoh</span>
            <b>
              {
                complete.filter(
                  (p) => SCENARIOS[p.scenario].email === "delivered",
                ).length
              }
            </b>
          </div>
          <Link href="/demo/admin/emails">
            Lihat semua status <ArrowRight size={15} />
          </Link>
        </article>
      </section>
      <ParticipantTable title="Latest crunchers" limit={5} />
    </>
  );
}
export function ParticipantTable({
  title = "Semua peserta",
  limit,
}: {
  title?: string;
  limit?: number;
}) {
  const { rows, hydrated } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(0);
  const filtered = useMemo(
    () =>
      rows
        .filter(
          (p) =>
            `${p.id} ${IDENTITIES[p.identity].name} ${IDENTITIES[p.identity].email}`
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (filter === "all" || p.status === filter) &&
            (!date ||
              new Date(new Date(p.createdAt).getTime() + 7 * 3600000)
                .toISOString()
                .slice(0, 10) === date),
        )
        .sort((a, b) =>
          sort === "score"
            ? (b.status === "completed"
                ? (SCENARIOS[b.scenario].score ?? -1)
                : -1) -
              (a.status === "completed"
                ? (SCENARIOS[a.scenario].score ?? -1)
                : -1)
            : Date.parse(b.createdAt) - Date.parse(a.createdAt),
        ),
    [rows, search, filter, date, sort],
  );
  const pageSize = limit ?? 8;
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  function downloadCsv() {
    const url = URL.createObjectURL(
      new Blob([participantsCsv(filtered)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "lays-demo-participants.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="table-card">
      <div className="section-title">
        <h2>
          {title} <span className="count-pill">{filtered.length}</span>
        </h2>
        <button
          className="button button-outline button-small"
          onClick={downloadCsv}
        >
          <ArrowDownToLine size={15} /> Export CSV
        </button>
      </div>
      <div className="table-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Cari peserta"
            placeholder="Cari nama, email, atau ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </label>
        <select
          aria-label="Filter status"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">Semua status</option>
          <option value="completed">Selesai</option>
          <option value="registered">Terdaftar</option>
          <option value="invalid">Invalid</option>
        </select>
        <select
          aria-label="Urutkan peserta"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="newest">Terbaru</option>
          <option value="score">Skor tertinggi</option>
        </select>
        <input
          type="date"
          aria-label="Filter tanggal WIB"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(0);
          }}
        />
        {date && (
          <button
            className="icon-button"
            aria-label="Hapus tanggal"
            onClick={() => {
              setDate("");
              setPage(0);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Peserta</th>
              <th>Waktu · WIB</th>
              <th>Challenge</th>
              <th>Score</th>
              <th>Reward</th>
              <th>Video</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {hydrated &&
              visible.map((p) => {
                const s = SCENARIOS[p.scenario];
                const person = IDENTITIES[p.identity];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="person-cell">
                        <span className={`avatar avatar-${p.identity}`}>
                          {person.initials}
                        </span>
                        <div>
                          <b>{person.name}</b>
                          <small>{person.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="date-cell">{time(p.createdAt)}</td>
                    <td>
                      <StatusBadge
                        kind={
                          p.status === "completed"
                            ? "success"
                            : p.status === "invalid"
                              ? "danger"
                              : "neutral"
                        }
                      >
                        {p.status === "completed"
                          ? "Selesai"
                          : p.status === "invalid"
                            ? "Invalid"
                            : "Terdaftar"}
                      </StatusBadge>
                    </td>
                    <td>
                      <strong className="table-score">
                        {p.status === "completed" ? s.score : "—"}
                      </strong>
                    </td>
                    <td>
                      {p.status === "completed" && s.reward ? (
                        <span className="winner-label">
                          <Gift size={13} /> Demo winner
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <StatusBadge
                        kind={
                          p.status === "completed" && s.video === "ready"
                            ? "success"
                            : "warning"
                        }
                      >
                        {p.status === "completed" ? s.video : "unavailable"}
                      </StatusBadge>
                    </td>
                    <td>
                      <Link
                        className="table-detail"
                        href={`/demo/admin/participants/${p.id}`}
                        aria-label={`Detail ${person.name}`}
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {hydrated && !visible.length && (
          <div className="empty-state">
            <Search size={24} />
            <h3>Tidak ada peserta yang cocok.</h3>
            <p>Coba nama atau filter lainnya.</p>
          </div>
        )}
        {!hydrated && <p className="empty-state">Memuat sesi demo…</p>}
      </div>
      <div className="table-footer">
        <span>
          {filtered.length ? page * pageSize + 1 : 0}–
          {Math.min((page + 1) * pageSize, filtered.length)} dari{" "}
          {filtered.length} peserta sintetis
        </span>
        {limit ? (
          <Link href="/demo/admin/participants" className="text-link">
            Semua peserta <ArrowRight size={14} />
          </Link>
        ) : (
          <div>
            <button
              aria-label="Halaman sebelumnya"
              className="icon-button"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Halaman berikutnya"
              className="icon-button"
              disabled={(page + 1) * pageSize >= filtered.length}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
export function ParticipantDetail({ id }: { id: string }) {
  const { rows, hydrated } = useDemo();
  const p = rows.find((row) => row.id === id);
  if (!hydrated) return <p>Memuat sesi demo…</p>;
  if (!p)
    return (
      <div className="empty-state">
        <h1>Peserta tidak ada di sesi ini.</h1>
        <p>
          Data demo kiosk bersifat lokal. Tautan hasil QR menggunakan skenario
          tetap yang terpisah.
        </p>
        <Link href="/demo/admin/participants" className="button button-dark">
          Kembali ke peserta
        </Link>
      </div>
    );
  const s = SCENARIOS[p.scenario];
  const identity = IDENTITIES[p.identity];
  const complete = p.status === "completed";
  return (
    <>
      <Link href="/demo/admin/participants" className="text-link">
        <ArrowLeft size={15} /> Semua peserta
      </Link>
      <div className="admin-title">
        <div>
          <span className="eyebrow">PARTICIPANT DETAIL / READ ONLY</span>
          <h1>{identity.name}</h1>
          <p className="break-anywhere">{p.id}</p>
        </div>
        <StatusBadge kind={complete ? "success" : "warning"}>
          {p.status}
        </StatusBadge>
      </div>
      <div className="detail-grid">
        <section className="admin-panel">
          <h2>Participant information</h2>
          <dl>
            <dt>Nama sintetis</dt>
            <dd>{identity.name}</dd>
            <dt>Email contoh</dt>
            <dd>{identity.email}</dd>
            <dt>Terdaftar</dt>
            <dd>{time(p.createdAt)} WIB</dd>
            <dt>Consent</dt>
            <dd>Simulasi partisipasi · v1</dd>
            <dt>Marketing</dt>
            <dd>Tidak dikumpulkan</dd>
            <dt>Sumber</dt>
            <dd>Demo kiosk / fixture sintetis</dd>
          </dl>
          <h2>Challenge result</h2>
          <div className="detail-score">
            {complete ? s.score : "—"}
            <small> / 100 · SIMULASI</small>
          </div>
          <dl>
            <dt>Durasi</dt>
            <dd>
              {p.durationMs
                ? `${p.durationMs / 1000} detik simulasi`
                : "Belum selesai"}
            </dd>
            <dt>Reward</dt>
            <dd>
              {complete && s.reward
                ? "Lay’s Good Vibes Kit · Ilustrasi"
                : "Tidak dialokasikan"}
            </dd>
            <dt>Klaim fisik</dt>
            <dd>Tidak tersedia dalam demo</dd>
            <dt>Email</dt>
            <dd>{complete ? s.email : "not-sent"} · simulasi</dd>
          </dl>
          <Link
            href={`/demo/admin/email-preview?scenario=${p.scenario}&identity=${p.identity}`}
            className="text-link"
          >
            Preview email <ArrowUpRight size={16} />
          </Link>
        </section>
        <section className="admin-panel">
          <div className="section-title">
            <h2>Recorded moment</h2>
            <StatusBadge>{complete ? s.video : "unavailable"}</StatusBadge>
          </div>
          {complete && s.video === "ready" ? (
            <VideoPlayer download />
          ) : (
            <div className="empty-state">
              <Film size={36} />
              <h3>
                {complete && s.video === "pending"
                  ? "Video pending · simulasi"
                  : "Rekaman tidak tersedia"}
              </h3>
              <p>
                {p.status === "invalid"
                  ? "Input tidak valid. Tidak ada skor atau hadiah."
                  : "Status ini adalah contoh untuk presentasi."}
              </p>
              <Link href="/demo/result/win" className="text-link">
                Lihat video contoh terpisah <ArrowRight size={15} />
              </Link>
            </div>
          )}
          <p className="small-copy">
            Video ilustrasi yang sama digunakan untuk hasil demo siap. Bukan
            rekaman peserta.
          </p>
          <Link href={`/demo/result/${p.scenario}`} className="text-link">
            Buka halaman QR sintetis <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
export function Monitoring({
  kind,
}: {
  kind: "videos" | "emails" | "rewards";
}) {
  const { rows } = useDemo();
  const labels = {
    videos: ["Video library", "Rekaman contoh dan status pemrosesan."],
    emails: [
      "Email delivery",
      "Pantau status contoh. Tidak ada email yang benar-benar dikirim.",
    ],
    rewards: [
      "Reward moments",
      "Kualifikasi sintetis. Tidak ada stok atau hadiah nyata.",
    ],
  };
  return (
    <>
      <div className="admin-title">
        <div>
          <span className="eyebrow">DEMO MONITORING</span>
          <h1>{labels[kind][0]}</h1>
          <p>{labels[kind][1]}</p>
        </div>
        {kind === "emails" && (
          <Link
            className="button button-dark button-small"
            href="/demo/admin/email-preview"
          >
            Preview template <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
      <div className="monitor-grid">
        {rows.map((p) => {
          const s = SCENARIOS[p.scenario];
          const valid = p.status === "completed";
          return (
            <article className="admin-panel monitor-card" key={p.id}>
              <div className="section-title">
                <h2>{IDENTITIES[p.identity].name}</h2>
                <StatusBadge
                  kind={
                    valid && (kind !== "videos" || s.video === "ready")
                      ? "success"
                      : "warning"
                  }
                >
                  {!valid
                    ? "not-ready"
                    : kind === "videos"
                      ? s.video
                      : kind === "emails"
                        ? s.email
                        : s.reward
                          ? "qualified (demo)"
                          : "not-qualified"}
                </StatusBadge>
              </div>
              {kind === "videos" && valid && s.video === "ready" ? (
                <VideoPlayer compact />
              ) : (
                <div className="monitor-icon">
                  {kind === "videos" ? (
                    <Film size={40} />
                  ) : kind === "emails" ? (
                    <Mail size={40} />
                  ) : (
                    <Gift size={40} />
                  )}
                </div>
              )}
              <p>
                {kind === "rewards"
                  ? valid && s.reward
                    ? "Lay’s Good Vibes Kit · Tidak dapat ditukarkan"
                    : "Tidak ada alokasi hadiah"
                  : kind === "emails"
                    ? "Penerima sintetis · " + IDENTITIES[p.identity].email
                    : "Video ilustrasi untuk presentasi"}
              </p>
              <Link
                className="text-link"
                href={`/demo/admin/participants/${p.id}`}
              >
                Lihat detail <ArrowUpRight size={15} />
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
