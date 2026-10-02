"use client";

import { useId, useState, type FormEvent } from "react";
import { email } from "@/lib/site";

type EnquiryFormProps = {
  intent: "supply" | "visit";
};

export function EnquiryForm({ intent }: EnquiryFormProps) {
  const base = useId();
  const [noted, setNoted] = useState(false);
  const supply = intent === "supply";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").trim();
    const lines = [
      `Name: ${String(data.get("name") ?? "")}`,
      supply ? `Business: ${String(data.get("business") ?? "")}` : null,
      `Email: ${String(data.get("email") ?? "")}`,
      phone ? `Phone: ${phone}` : null,
      "",
      String(data.get("message") ?? ""),
    ].filter((line): line is string => line !== null);

    const subject = encodeURIComponent(
      supply ? "Regular order enquiry" : "Message for the Organic Market",
    );
    const body = encodeURIComponent(lines.join("\n"));
    setNoted(true);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl" noValidate={false}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${base}-name`} label="Your name" name="name" autoComplete="name" required />
        {supply ? (
          <Field
            id={`${base}-business`}
            label="Business"
            name="business"
            autoComplete="organization"
            required
          />
        ) : null}
        <Field
          id={`${base}-email`}
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field id={`${base}-phone`} label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="mt-5">
        <label htmlFor={`${base}-message`} className="block text-[0.95rem]">
          {supply ? "What you need, and how often" : "Message"}
        </label>
        <textarea
          id={`${base}-message`}
          name="message"
          required
          rows={6}
          className="input"
        />
      </div>
      <button className="btn mt-6" type="submit">
        {supply ? "Email this order enquiry" : "Email the shop"}
      </button>
      <p className="mt-4 max-w-[48ch] text-[0.95rem] text-ink/75" role="status">
        {noted
          ? `If your email app did not open, write directly to ${email}.`
          : `This opens your email app, addressed to ${email}.`}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="input"
      />
    </div>
  );
}
