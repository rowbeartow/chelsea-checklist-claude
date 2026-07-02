import Link from "next/link";
import { CHELSEA_EMAIL, CHELSEA_NAME } from "@/lib/config";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-6 py-12 text-ink">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-8 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-lg font-bold text-white">
          {CHELSEA_NAME[0]}
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink/50">Link not found</p>
        <h1 className="mt-2 text-2xl font-semibold">This checklist link isn&apos;t active.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/68">
          The link may have expired or been mistyped.{" "}
          {CHELSEA_EMAIL ? (
            <>
              Reach out to{" "}
              <a href={`mailto:${CHELSEA_EMAIL}`} className="font-semibold text-accent hover:underline">
                {CHELSEA_NAME}
              </a>{" "}
              and she&apos;ll send you the correct link.
            </>
          ) : (
            <>Ask {CHELSEA_NAME} to resend the link.</>
          )}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/c/demo-buyer"
            className="inline-flex rounded-md border border-ink bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
          >
            View demo checklist
          </Link>
          {CHELSEA_EMAIL ? (
            <a
              href={`mailto:${CHELSEA_EMAIL}`}
              className="inline-flex rounded-md border border-line px-4 py-2 text-sm font-semibold hover:border-ink"
            >
              Email {CHELSEA_NAME}
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
