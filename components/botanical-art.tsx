type BotanicalArtProps = {
  variant?: "sprig" | "coffee" | "hills";
  className?: string;
};

/** Decorative line drawings inspired by the produce, café and Adelaide Hills. */
export function BotanicalArt({ variant = "sprig", className = "" }: BotanicalArtProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {variant === "sprig" ? (
        <>
          <path d="M56 216C77 165 100 115 175 31" />
          <path d="M81 164C42 167 30 141 35 112c29 3 48 19 46 52ZM101 128C69 125 58 97 68 71c27 9 40 30 33 57ZM129 90C106 75 111 44 137 24c17 20 15 44-8 66ZM85 157c6-34 33-52 63-44-8 27-30 44-63 44ZM116 107c14-30 39-40 67-28-13 24-38 33-67 28ZM153 62c4-27 26-42 53-39-5 27-24 41-53 39Z" />
          <path d="m49 128 31 34m2-75 19 41m37-82-9 44m-26 53 30-18m0-28 33-8m-3-38 29-17" opacity=".55" />
          <path d="M46 194c-8-8-10-17-6-27m142-50 8-12m-10 1 13 9" />
        </>
      ) : variant === "coffee" ? (
        <>
          <path d="M55 96h105v40c0 34-20 53-52 53s-53-19-53-53V96ZM161 107h13c34 0 34 46 0 46h-16M38 199h144M92 74c-20-23 22-27 5-49m27 49c-20-23 22-27 5-49" />
          <ellipse cx="188" cy="55" rx="16" ry="24" transform="rotate(35 188 55)" />
          <path d="M199 35c-22 9 0 31-22 40" />
          <path d="m31 55 9-10m-10 0 12 10M195 185l8-10m-10 1 13 8" />
        </>
      ) : (
        <>
          <circle cx="173" cy="62" r="24" />
          <path d="M12 145c44-70 72-74 118-21 43-31 64-21 98 13M12 169c43-31 79-42 121-19 44 25 68 29 95 6M12 195c57-36 100-14 142-6 31 6 51 6 74-4M12 219c54-24 118-7 165-5 17 1 34-1 51-6" />
          <path d="M60 131V84m0 29c-21-1-27-16-24-29 18 1 25 13 24 29Zm0-14c1-17 13-26 27-22 0 15-10 24-27 22ZM202 108V85m-8 9 8 6 9-14" />
        </>
      )}
    </svg>
  );
}
