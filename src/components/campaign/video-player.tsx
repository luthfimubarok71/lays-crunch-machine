"use client";
import { useState } from "react";
import { Download, Film, RotateCcw } from "lucide-react";
import { SAMPLE_POSTER, SAMPLE_VIDEO } from "@/domain/demo";
export function VideoPlayer({
  download = false,
  compact = false,
}: {
  download?: boolean;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);
  return (
    <div className={`video-block ${compact ? "video-compact" : ""}`}>
      <div className="video-frame">
        {failed ? (
          <div className="video-error">
            <Film />
            <p>Video contoh tidak dapat dimuat.</p>
            <button
              className="button button-light"
              onClick={() => {
                setFailed(false);
                setKey(key + 1);
              }}
            >
              <RotateCcw size={16} /> Coba lagi
            </button>
          </div>
        ) : (
          <video
            key={key}
            controls
            playsInline
            preload="metadata"
            poster={SAMPLE_POSTER}
            onError={() => setFailed(true)}
            aria-label="Video contoh sintetis 10 detik"
          >
            <source src={SAMPLE_VIDEO} type="video/mp4" />
            Browser ini tidak mendukung video.
          </video>
        )}
        <span className="sample-tag">SAMPLE VIDEO · 10 SEC</span>
      </div>
      {download && (
        <a
          className="button button-outline download-button"
          href={SAMPLE_VIDEO}
          download="lays-crunch-DEMO.mp4"
        >
          <Download size={18} /> Unduh video contoh
        </a>
      )}
    </div>
  );
}
