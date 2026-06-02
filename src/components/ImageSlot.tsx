import type { CSSProperties } from "react";
import { ImageIcon, User } from "lucide-react";

/**
 * Stand-in for the design prototype's <image-slot> custom element.
 * Renders a clearly-marked placeholder where a real photo / slide / avatar
 * should be dropped in. Sizing/shape come from the parent CSS selectors
 * (.presenter-photo .image-slot, .player-stage .image-slot, …).
 */
export function ImageSlot({
  label,
  avatar = false,
  compact = false,
  className,
  style,
}: {
  label?: string;
  avatar?: boolean;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`image-slot${className ? " " + className : ""}`} style={style}>
      <div className="is-inner">
        {avatar ? <User aria-hidden /> : <ImageIcon aria-hidden />}
        {!compact && label ? <span className="is-label">{label}</span> : null}
      </div>
    </div>
  );
}
