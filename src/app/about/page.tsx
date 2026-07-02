import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/i18n";
import { SITE_NAME, absoluteUrl, localizedAbsoluteUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);

  return buildMetadata({
    locale,
    title: messages.about.metadataTitle,
    description: messages.about.metadataDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const messages = getTranslations(locale);
  const benefits = messages.about.benefits;
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: messages.about.metadataTitle,
    description: messages.about.metadataDescription,
    url: localizedAbsoluteUrl(locale, "/about"),
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: localizedAbsoluteUrl(locale, "/"),
      logo: absoluteUrl("/images/aroma-logo.png"),
      sameAs: ["https://instagram.com/aroma___parfumee"],
    },
  };

  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{messages.about.eyebrow}</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight text-[var(--foreground)]">
            {messages.about.title}
          </h1>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[var(--text-soft)]">
          <p>{messages.about.textOne}</p>
          <p>{messages.about.textTwo}</p>
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
