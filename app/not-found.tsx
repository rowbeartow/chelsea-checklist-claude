import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-6 py-12 text-ink">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase text-ink/58">Checklist unavailable</p>
        <h1 className="mt-3 text-3xl font-semibold">This private link was not found.</h1>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          Ask Chelsea to resend the checklist link if you expected to see your real estate plan here.
        </p>
        <Link
          href="/c/demo-buyer"
          className="mt-6 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          View demo checklist
        </Link>
      </section>
    </main>
  );
}
