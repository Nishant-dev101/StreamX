import { Loader2 } from "lucide-react";

const PALETTE = {
    page: "#EFE9DC",
    card: "#e7decb",
    rail: "#182821",
    railText: "#EFE9DC",
    ink: "#1B1B1E",
    muted: "#8A8375",
    line: "#f7f4ee",
    accent: "#2F6F5E",
    accentDark: "#215043",
    error: "#A23B1E",
};

/**
 * LoadingBanner
 * Inline banner shown while waiting on a backend response.
 * Matches the stub-card / mono-label aesthetic used across the app.
 *
 * Props:
 *  - label: primary text (default "Working on it")
 *  - subLabel: secondary mono caption (default "Talking to the server…")
 *  - fullOverlay: if true, covers the parent card with a semi-opaque veil
 *                 instead of rendering as a plain inline strip
 */
export const LoadingBanner = ({
  label = "Working on it",
  subLabel = "Please Wait…",
}) => {
  const content = (
    <div
      className="flex items-center gap-3 p-4 rounded-lg"
      style={{
        backgroundColor: PALETTE.card,
        border: `1px solid ${PALETTE.line}`,
        borderLeft: `3px solid ${PALETTE.accent}`,
      }}
    >
      <Loader2
        size={50}
        color={PALETTE.accent}
        className="animate-spin flex-shrink-0"
      />
      <div className="flex flex-col">
        <span className="font-body text-sm" style={{ color: PALETTE.ink }}>
          {label}
        </span>
        <span
          className="font-mono text-2xl tracking-widest uppercase"
          style={{ color: PALETTE.muted }}
        >
          {subLabel}
        </span>
      </div>
    </div>
  );

 

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-6 z-10"
      style={{ backgroundColor: PALETTE.page}}
    >
      {content}
    </div>
  );
}
