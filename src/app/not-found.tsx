import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-transparent">
      <Image
        src="/images/perfume-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-[0.12]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,12,0.96),rgba(10,11,12,0.9),rgba(10,11,12,0.96))]" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(21,24,25,0.96),rgba(29,33,34,0.96))] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.34)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            404
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-[var(--foreground)] sm:text-6xl">
            Էջը չի գտնվել
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
            Հնարավոր է հղումը սխալ է, էջը տեղափոխվել է, կամ այդ հասցեն այլևս գոյություն չունի։
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[var(--accent-strong)] hover:border-[var(--accent-strong)]"
            >
              Գլխավոր էջ
            </Link>
            <Link
              href="/catalog"
              className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Բացել կատալոգը
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <InfoCard title="Կատալոգ" text="Դիտեք ամբողջ օծանելիքի հավաքածուն մեկ էջում։" href="/catalog" />
            <InfoCard title="Բրենդներ" text="Բացեք բրենդների էջը և ընտրեք սիրելի տունը։" href="/brands" />
            <InfoCard title="Կոնտակտներ" text="Գրեք մեզ WhatsApp-ով կամ Instagram-ում։" href="/contacts" />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-elevated)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{title}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{text}</p>
    </Link>
  );
}
