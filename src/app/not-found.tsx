import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[linear-gradient(180deg,#f4f1eb_0%,#faf7f2_45%,#fffdf9_100%)]">
      <Image
        src="/images/perfume-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-[0.12]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,249,0.96),rgba(255,253,249,0.88),rgba(255,253,249,0.96))]" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(243,238,231,0.96))] p-8 shadow-[0_28px_80px_rgba(71,58,44,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            404
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-zinc-950 sm:text-6xl">
            Էջը չի գտնվել
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
            Հնարավոր է հղումը սխալ է, էջը տեղափոխվել է, կամ այդ հասցեն այլևս գոյություն չունի։
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              Գլխավոր էջ
            </Link>
            <Link
              href="/catalog"
              className="rounded-full border border-zinc-300 bg-white/90 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
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
      className="rounded-[24px] border border-[var(--line)] bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-zinc-950"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{title}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
    </Link>
  );
}
