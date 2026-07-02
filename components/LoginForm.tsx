"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured yet. Local demo mode keeps /admin open.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    // next.js typed router needs a route literal; nextPath is server-validated to start with "/"
    router.push(nextPath as Parameters<typeof router.push>[0]);
    router.refresh();
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-bold">
        Email
        <input
          autoComplete="email"
          className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Password
        <input
          autoComplete="current-password"
          className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <Lock className="h-4 w-4" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      {message ? <p className="rounded-md bg-cloud px-3 py-2 text-sm text-ink/72">{message}</p> : null}
    </form>
  );
}
