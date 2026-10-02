"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function AccountForm({ mode }: { mode: "login" | "register" }) {
  const [message, setMessage] = useState("");
  const registering = mode === "register";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (registering && form.get("password") !== form.get("confirmPassword")) {
      setMessage("The passwords do not match.");
      return;
    }

    setMessage("Account access is not connected yet. Your details were not sent or saved.");
  }

  return (
    <div className="border border-line bg-white p-6 md:p-8">
      <p className="mb-6 text-sm text-ink/60">
        {registering ? "Create an account for a quicker shop." : "Sign in to your account."}
      </p>
      <form onSubmit={onSubmit} className="grid gap-5">
        {registering ? (
          <Field label="Name" name="name" type="text" autoComplete="name" required />
        ) : null}
        <Field label="Email address" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength={8}
          required
        />
        {registering ? (
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        ) : null}
        <button type="submit" className="btn mt-2 w-full">
          {registering ? "Create account" : "Login"}
        </button>
      </form>
      {message ? (
        <p role="status" className="mt-4 text-sm text-ink/70">
          {message}
        </p>
      ) : null}
      <p className="mt-6 border-t border-line pt-5 text-sm text-ink/65">
        {registering ? "Already have an account? " : "New to the shop? "}
        <Link className="link text-ink" href={registering ? "/login" : "/register"}>
          {registering ? "Login" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  minLength,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  minLength?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm" htmlFor={`account-${name}`}>
      {label}
      <input
        id={`account-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className="input"
      />
    </label>
  );
}
