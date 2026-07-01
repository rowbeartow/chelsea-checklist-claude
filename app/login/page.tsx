import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { isSupabaseAuthConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin";
  const authConfigured = isSupabaseAuthConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-4 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-accent">Chelsea Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-ink/68">
          Supabase Auth protects the admin area once project environment variables are configured.
        </p>

        {!authConfigured ? (
          <div className="mt-6 rounded-lg border border-warning/25 bg-warningSoft p-3 text-sm leading-6 text-warning">
            Supabase Auth is not configured in this local workspace yet. The admin editor remains available in demo mode.
          </div>
        ) : null}

        {params.error === "not_admin" ? (
          <div className="mt-6 rounded-lg border border-danger/25 bg-dangerSoft p-3 text-sm leading-6 text-danger">
            You are signed in, but your profile is not marked as an admin.
          </div>
        ) : null}

        <LoginForm nextPath={nextPath} />

        <Link className="mt-5 inline-flex text-sm font-bold text-ink/68 hover:text-ink" href="/admin">
          Back to admin
        </Link>
      </section>
    </main>
  );
}
