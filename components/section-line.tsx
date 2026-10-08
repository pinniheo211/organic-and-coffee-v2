type SectionLineProps = {
  className?: string;
};

/** Large, continuous line artwork that fills open space around section content. */
export function SectionLine({ className = "" }: SectionLineProps) {
  const path = "M-120 430C0 430 0 170 130 170S260 430 390 430 520 170 650 170 780 430 920 430";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`section-line ${className}`}
      viewBox="0 0 800 600"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} data-line-draw />
      </g>
    </svg>
  );
}
