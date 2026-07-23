export function ArchMark({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 24 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 27 V11 A10 10 0 0 1 22 11 V27" stroke="currentColor" strokeWidth="2" />
      <path d="M2 27 H22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
