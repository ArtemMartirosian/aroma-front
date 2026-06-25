export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Կոնտակտներ</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Կոնտակտներ</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
        Խանութը գործում է միայն օնլայն։ Գրեք կամ զանգահարեք մեզ, որպեսզի ընտրեք
        բույրը, ծավալը և ձևակերպեք առաքումը։
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Contact label="Հեռախոս" value="+374 33 69 60 09" />
          <Contact label="WhatsApp" value="+374 33 69 60 09" />
          <Contact label="Instagram" value="@aroma__parfume" />
          <Contact label="Էլ. փոստ" value="hello@aroma.local" />
          <Contact label="Առաքում" value="Անվճար" />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Միայն օնլայն</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-950">
            Առանց օֆլայն խանութի, անվճար առաքմամբ
          </h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Պատվերը ձևակերպվում է WhatsApp-ով կամ հեռախոսով։ Մենք համաձայնեցնում ենք
            մանրամասները, օգնում ընտրել ծավալը և ուղարկում պատվերը անվճար առաքմամբ։
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/37433696009"
              className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              Գրել WhatsApp-ով
            </a>
            <a
              href="https://instagram.com/aroma__parfume"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Գրել Instagram-ում
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-zinc-100 py-4 last:border-0">
      <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
