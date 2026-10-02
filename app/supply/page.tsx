import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/page-hero";
import { buyers } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Supply",
  description:
    "Regular organic and wholefood orders for cafés, retailers, offices and households from the Organic Market in Stirling.",
};

const steps = [
  {
    title: "Tell us what you buy",
    text: "Name the business, the lines you need, and how often you need them.",
  },
  {
    title: "We answer from the shop",
    text: "The Stirling floor replies with what we can hold, order in, or suggest from what is already there.",
  },
  {
    title: "Collect, or we deliver",
    text: "Pick up from 5 Druid Avenue, use click and collect, or home delivery on the same terms as the online store.",
  },
];

export default function SupplyPage() {
  return (
    <article>
      <PageHero title="Supply for people who buy every week">
        Cafés, restaurants, retailers and offices use the same floor as the household shop. A
        regular order is a conversation with Stirling, not a separate warehouse.
      </PageHero>

      <section data-reveal-group className="mx-auto max-w-[76rem] px-5 py-16 md:py-20">
        <p className="eyebrow">Who it is for</p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">Buyers we already know</h2>
        <table className="mt-8 w-full border-collapse text-left">
          <caption className="sr-only">Who the shop supplies, and what they usually need</caption>
          <tbody>
            {buyers.map((row) => (
              <tr key={row.who} className="border-b border-line">
                <th
                  scope="row"
                  className="w-[40%] py-5 pr-6 align-top font-serif text-2xl font-normal md:w-[18rem]"
                >
                  {row.who}
                </th>
                <td className="py-5 align-top text-ink/70">{row.need}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 max-w-[56ch] text-ink/70">
          A single basket is quicker in the{" "}
          <Link className="link" href="/shop">
            online shop
          </Link>
          .
        </p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[76rem] px-5 py-16 md:py-20">
          <p data-reveal className="eyebrow">Getting started</p>
          <h2 data-reveal className="mt-4 font-serif text-4xl tracking-[-0.03em]">How an account starts</h2>
          <ol data-reveal-group className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="font-serif text-3xl">{index + 1}</p>
                <h3 className="mt-3 font-medium">{step.title}</h3>
                <p className="mt-2 text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-24">
        <div data-reveal-group className="mx-auto max-w-[76rem] px-5 py-16 md:py-24">
          <p className="eyebrow">A regular order</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">Ask about supply</h2>
          <p className="mt-4 mb-8 max-w-[48ch] text-ink/70">
            Write what you cook or sell, and the rough size of the order. We reply from the shop.
          </p>
          <EnquiryForm intent="supply" />
        </div>
      </section>
    </article>
  );
}
