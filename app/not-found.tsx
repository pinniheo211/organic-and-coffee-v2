import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[40rem] px-5 py-24 text-center">
      <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">
        This page is not on the site.
      </h1>
      <p className="mx-auto mt-4 max-w-[42ch] text-ink/65">
        The address may be out of date. The market, café, supply desk and visit details are on
        the front page.
      </p>
      <Link className="btn mt-8" href="/">
        Back to the front page
      </Link>
    </div>
  );
}
