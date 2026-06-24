export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Contacts</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Контакты</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Contact label="Телефон" value="+374 00 000 000" />
          <Contact label="WhatsApp" value="+374 00 000 000" />
          <Contact label="Instagram" value="@aroma.perfume" />
          <Contact label="Email" value="hello@aroma.local" />
          <Contact label="Адрес" value="Yerevan, Armenia" />
        </div>
        <div className="min-h-[360px] rounded-lg border border-zinc-200 bg-zinc-100 p-6 shadow-sm">
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white text-center text-zinc-500">
            Здесь можно подключить Google Maps или Яндекс.Карту для офлайн-магазина.
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
