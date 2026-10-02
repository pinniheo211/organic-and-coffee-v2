import { AddToBasket } from "@/components/add-to-basket";
import { formatPrice, getProduct, products } from "@/lib/catalog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Shop online" };
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-[76rem] px-5 py-12 md:py-20">
      <p>
        <Link className="link" href="/shop">
          Shop
        </Link>
      </p>
      <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
        <div className="relative flex min-h-80 items-center justify-center bg-white md:min-h-[32rem]">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 36rem, 100vw"
              className={product.image.endsWith(".webp") ? "object-contain p-10 mix-blend-multiply" : "object-cover"}
            />
          ) : (
            <span className="font-serif text-3xl text-ink/25">{product.category}</span>
          )}
        </div>
        <div>
          <p className="text-ink/50">{product.category}</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-lg">
            {formatPrice(product.price)} · {product.unit}
          </p>
          <p className="mt-5 max-w-[42ch] text-ink/70">{product.summary}</p>
          <AddToBasket slug={product.slug} />
        </div>
      </div>
      {others.length > 0 ? (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-serif text-3xl tracking-[-0.03em]">Also in {product.category.toLowerCase()}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/shop/${item.slug}`} className="font-serif text-2xl tracking-[-0.03em]">
                  {item.name}
                </Link>
                <p className="text-ink/55">{formatPrice(item.price)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
