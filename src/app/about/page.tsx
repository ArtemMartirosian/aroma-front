export default function AboutPage() {
  const benefits = [
    "Օրիգինալ արտադրանք և հասկանալի բույրերի քարտեր",
    "Ֆիլտրեր ըստ բրենդի, սեռի, տեսակի, ծավալի և գնի",
    "Արագ կապ WhatsApp-ով՝ բարդ զամբյուղի փոխարեն",
    "Անվճար առաքում օնլայն պատվերների համար",
  ];

  return (
    <div className="bg-transparent">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Մեր մասին</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight text-[var(--foreground)]">
            Օծանելիքի գեղեցիկ կատալոգ՝ հանգիստ ընտրության համար
          </h1>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[var(--text-soft)]">
          <p>
            AROMA-ն ստեղծված է որպես վիտրինա․ օգտատերը դիտում է ապրանքները,
            ուսումնասիրում նոտաները, ծավալները, գները և կապվում է մեզ հետ անմիջապես։
          </p>
          <p>
            Խանութը գործում է միայն օնլայն՝ առանց օֆլայն կետի, քարտեզի և
            զամբյուղի։ Պատվերները ձևակերպվում են WhatsApp-ով կամ հեռախոսով,
            առաքումն անվճար է։
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-elevated)] p-5 shadow-[0_16px_34px_rgba(0,0,0,0.24)]">
              <p className="font-semibold leading-7 text-[var(--foreground)]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
