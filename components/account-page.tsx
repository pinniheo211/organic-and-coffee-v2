import Image from "next/image";
import { AccountForm } from "@/components/account-form";

type AccountPageProps = {
  mode: "login" | "register";
};

export function AccountPage({ mode: initialMode }: AccountPageProps) {
  const mode = initialMode;
  const registering = mode === "register";
  const title = registering ? "Create an account" : "Welcome back";

  return (
    <article data-intro className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_0.92fr] md:items-center md:gap-12 md:px-8 md:py-16">
      <figure className={`relative m-0 aspect-[16/8] overflow-hidden bg-sage md:aspect-[4/5] ${registering ? "md:order-2" : "md:order-1"}`}>
        <Image
          src={registering ? "/assets/shop.webp" : "/assets/story2.webp"}
          alt={registering
            ? "The Organic Market storefront beneath autumn vines"
            : "A team member serving a customer at the Organic Market counter"}
          fill
          priority
          sizes="(min-width: 768px) 46vw, 100vw"
          className="object-cover object-center"
        />
      </figure>

      <div className={`mx-auto w-full max-w-xl py-2 md:py-8 ${registering ? "md:order-1" : "md:order-2"}`}>
        <p data-intro-item className="eyebrow">Your account</p>
        <h1 data-intro-item className="mt-3 font-serif text-5xl tracking-[-0.03em] md:text-6xl">
          {title}
        </h1>
        <div data-intro-item className="mt-8">
          <AccountForm mode={mode} />
        </div>
      </div>
    </article>
  );
}
