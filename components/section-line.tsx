type SectionLineProps = {
  className?: string;
  variant?: "loop" | "trail";
};

/** Large, continuous loop artwork that fills open space around section content. */
export function SectionLine({ className = "", variant = "loop" }: SectionLineProps) {
  const paths = variant === "loop"
    ? [
        "M-170 330C-170 181-49 60 100 60S370 181 370 330 249 600 100 600-170 479-170 330Z",
        "M110 590C110 441 231 320 380 320S650 441 650 590 529 860 380 860 110 739 110 590Z",
      ]
    : [
        "M-210 400C-210 246-85 120 70 120S350 246 350 400 225 680 70 680-210 554-210 400Z",
        "M130 610C130 455 256 330 410 330S690 455 690 610 565 890 410 890 130 765 130 610Z",
      ];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`section-line ${className}`}
      viewBox="0 0 800 600"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((path, index) => (
          <g key={`${variant}-${index}`}>
            <path d={path} opacity="0.22" />
            <path d={path} data-line-draw />
          </g>
        ))}
      </g>
    </svg>
  );
}
