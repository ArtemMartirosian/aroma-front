import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);

  return buildMetadata({
    locale,
    title: messages.contacts.metadataTitle,
    description: messages.contacts.metadataDescription,
    path: "/contacts",
  });
}

export default async function ContactsPage() {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{messages.contacts.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">{messages.contacts.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
        {messages.contacts.description}
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
          <Contact label={messages.contacts.phone} value="+374 33 69 60 09" href="tel:+37433696009" />
          <Contact label="WhatsApp" value="+374 33 69 60 09" href="https://wa.me/37433696009" />
          <Contact label="Viber" value="+374 33 69 60 09" href="viber://chat?number=%2B37433696009" />
          <Contact
            label="Instagram"
            value="@aroma___parfumee"
            href="https://instagram.com/aroma___parfumee"
          />
          <Contact
            label="TikTok"
            value="@aroma_parfume_"
            href="https://www.tiktok.com/@aroma_parfume_"
          />
          <Contact
            label="Facebook"
            value="Aroma Parfume"
            href="https://www.facebook.com/profile.php?id=61572896413532"
          />
          <Contact label={messages.contacts.delivery} value={messages.contacts.free} />
        </div>
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-8 shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{messages.contacts.quickContact}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {messages.contacts.quickTitle}
          </h2>
          <p className="mt-4 leading-7 text-[var(--text-soft)]">
            {messages.contacts.quickDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/37433696009"
              className="inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[var(--accent-strong)] hover:border-[var(--accent-strong)]"
            >
              {messages.contacts.writeWhatsApp}
            </a>
            <a
              href="viber://chat?number=%2B37433696009"
              className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              {messages.contacts.writeViber}
            </a>
            <a
              href="https://instagram.com/aroma___parfumee"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              {messages.contacts.writeInstagram}
            </a>
            <a
              href="https://www.tiktok.com/@aroma_parfume_"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              {messages.contacts.viewTikTok}
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
