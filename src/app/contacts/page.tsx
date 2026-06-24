export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Contacts</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Контакты</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
        Магазин работает только онлайн. Напишите или позвоните нам, чтобы уточнить
        наличие, подобрать аромат и оформить доставку.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Contact label="Телефон" value="+374 33 69 60 09" />
          <Contact label="WhatsApp" value="+374 33 69 60 09" />
          <Contact label="Instagram" value="@aroma__parfume" />
          <Contact label="Email" value="hello@aroma.local" />
          <Contact label="Доставка" value="Бесплатно" />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Online only</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-950">
            Без офлайн-магазина, с бесплатной доставкой
          </h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Заказ оформляется через WhatsApp или по телефону. Мы подтверждаем
            наличие, согласовываем детали и отправляем заказ доставкой бесплатно.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/37433696009"
              className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Написать в WhatsApp
            </a>
            <a
              href="https://instagram.com/aroma__parfume"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Написать в Instagram
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
