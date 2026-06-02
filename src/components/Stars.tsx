const STAR =
  "M12 2l2.9 6.2 6.8.6-5.1 4.5 1.5 6.7L12 17l-6 3.5 1.5-6.7L2.4 8.8l6.8-.6z";

export function Stars({
  count = 5,
  label,
}: {
  count?: number;
  label?: string;
}) {
  return (
    <span className="stars" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}
