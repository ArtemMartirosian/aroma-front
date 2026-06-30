import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Կոնտակտներ",
  description:
    "Կապվեք Aroma Parfume, կոսմետիկա և աքսեսուարներ-ի հետ WhatsApp-ով, հեռախոսով կամ Instagram-ով։ Արագ պատվերներ և անվճար առաքում Հայաստանում։",
  path: "/contacts",
});

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Կոնտակտներ</p>
      <h1 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">Կոնտակտներ</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
        Գրեք կամ զանգահարեք մեզ, որպեսզի ընտրեք օծանելիք, կոսմետիկա կամ
        աքսեսուարներ և արագ ձևակերպեք առաքումը։
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
          <Contact label="Հեռախոս" value="+374 33 69 60 09" href="tel:+37433696009" />
          <Contact label="WhatsApp" value="+374 33 69 60 09" href="https://wa.me/37433696009" />
          <Contact
            label="Instagram"
            value="@aroma___parfumee"
            href="https://instagram.com/aroma___parfumee"
          />
          <Contact
            label="Facebook"
            value="Aroma Parfume"
            href="https://www.facebook.com/profile.php?id=61572896413532"
          />
          <Contact label="Առաքում" value="Անվճար" />
        </div>
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-8 shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Արագ կապ</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Պատվերը ձևակերպվում է հեշտ և հարմար
          </h2>
          <p className="mt-4 leading-7 text-[var(--text-soft)]">
            WhatsApp-ով, Instagram-ով կամ հեռախոսով կարող եք ճշտել ապրանքի
            տարբերակը, առկայությունն ու առաքման մանրամասները։ Մենք օգնում ենք
            ընտրության հարցում և կազմակերպում անվճար առաքումը։
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/37433696009"
              className="inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[var(--accent-strong)] hover:border-[var(--accent-strong)]"
            >
              Գրել WhatsApp-ով
            </a>
            <a
              href="https://instagram.com/aroma__parfume"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Գրել Instagram-ում
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="border-b border-[var(--line)] py-4 last:border-0">
      <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="mt-1 inline-flex text-lg font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{value}</p>
      )}
    </div>
  );
}
