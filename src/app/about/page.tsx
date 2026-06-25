export default function AboutPage() {
  const benefits = [
    "Оригинальная продукция и понятные карточки ароматов",
    "Фильтры по бренду, полу, типу, объему и цене",
    "Быстрая связь через WhatsApp вместо сложной корзины",
    "Бесплатная доставка для онлайн-заказов",
  ];

  return (
    <div className="bg-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">About</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight text-zinc-950">
            Красивый каталог парфюмерии для спокойного выбора
          </h1>
        </div>
        <div className="space-y-5 text-lg leading-8 text-zinc-600">
          <p>
            AROMA создан как витрина: пользователь смотрит товары, изучает ноты,
            объемы, цены и связывается с нами напрямую.
          </p>
          <p>
            Магазин работает только онлайн: без офлайн-точки, без карты и без
            корзины. Заказы оформляются через WhatsApp или по телефону, доставка
            бесплатная.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <p className="font-semibold leading-7 text-zinc-950">{benefit}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
