"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/catalog/LocaleProvider";
import { localizePath } from "@/lib/routing";

export function SiteFooter() {
  const pathname = usePathname();
  const { locale, messages } = useLocale();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--line)] bg-[#0b0d0e] pb-[calc(env(safe-area-inset-bottom)+5.75rem)] text-[var(--foreground)] md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
              <Image
                  src="/images/aroma-logo.png"
                  alt="Aroma Parfume, cosmetics & accessoires"
                  width={280}
                  height={280}
                  priority
                  className="h-14 w-auto scale-110 sm:h-16"
              />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-soft)]">
            {messages.footer.description}
          </p>
          <div className="mt-5 max-w-sm text-sm text-[var(--text-soft)]">
            <p className="font-semibold text-[var(--foreground)]">{messages.footer.partners}</p>
            <div className="mt-2 flex flex-col gap-1.5">
              <FooterTextLink
                href="https://instagram.com/aroma___parfumee"
                label="Aroma Parfume - @aroma___parfumee"
              />
              <FooterTextLink
                href="https://instagram.com/aroma_auto___"
                label="Aroma Auto - @aroma_auto___"
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-[var(--text-soft)]">
          <p className="font-semibold text-[var(--foreground)]">{messages.footer.navigation}</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href={localizePath(locale, "/catalog")}>{messages.nav.catalog}</Link>
            <Link href={localizePath(locale, "/brands")}>{messages.nav.brands}</Link>
            <Link href={localizePath(locale, "/about")}>{messages.nav.about}</Link>
            <Link href={localizePath(locale, "/contacts")}>{messages.nav.contacts}</Link>
          </div>
        </div>
        <div className="text-sm text-[var(--text-soft)]">
          <p className="font-semibold text-[var(--foreground)]">{messages.footer.contact}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <SocialLink href="https://wa.me/37433696009" label="WhatsApp">
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink href="viber://chat?number=%2B37433696009" label="Viber">
              <ViberIcon />
            </SocialLink>
            <SocialLink href="tel:+37433696009" label={messages.footer.phone}>
              <PhoneIcon />
            </SocialLink>
            <SocialLink href="https://instagram.com/aroma___parfumee" label="Instagram">
              <InstagramIcon />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@aroma_parfume_" label="TikTok">
              <TikTokIcon />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/profile.php?id=61572896413532" label="Facebook">
              <FacebookIcon />
            </SocialLink>
          </div>
          <div className="mt-4 space-y-1.5">
            <FooterTextLink href="https://wa.me/37433696009" label="WhatsApp: +374 33 69 60 09" />
            <FooterTextLink href="viber://chat?number=%2B37433696009" label="Viber: +374 33 69 60 09" />
            <FooterTextLink href="tel:+37433696009" label={`${messages.footer.phone}: +374 33 69 60 09`} external={false} />
            <FooterTextLink href="https://instagram.com/aroma___parfumee" label="Instagram: @aroma___parfumee" />
            <FooterTextLink href="https://www.tiktok.com/@aroma_parfume_" label="TikTok: @aroma_parfume_" />
            <FooterTextLink href="https://www.facebook.com/profile.php?id=61572896413532" label="Facebook: Aroma Parfume" />
          </div>
          <p>{messages.footer.delivery}</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-[var(--text-muted)] sm:px-6 sm:text-sm lg:px-8">
          <p>
            {messages.footer.builtBy}{" "}
            <a
              href="https://digitalize.am"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--accent-strong)] transition hover:text-[var(--accent)]"
            >
              Digitalize
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--foreground)] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {children}
    </a>
  );
}

function FooterTextLink({
  href,
  label,
  external = true,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="block transition hover:text-[var(--accent)]"
    >
      {label}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M13.4 20.5v-7h2.3l.4-2.7h-2.7V9.1c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7v2h-2.4v2.7h2.4v7h2.7Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M19.1 4.9A9.44 9.44 0 0 0 12.3 2C7 2 2.7 6.3 2.7 11.6c0 1.7.4 3.3 1.3 4.8L2.5 22l5.8-1.5c1.4.7 2.7 1 4.1 1 5.3 0 9.6-4.3 9.6-9.6 0-2.6-1-5-2.9-7Zm-6.7 15c-1.2 0-2.5-.3-3.6-1l-.3-.2-3.4.9.9-3.3-.2-.3a7.1 7.1 0 0 1-1.1-3.8c0-4.1 3.3-7.4 7.4-7.4 2 0 3.8.8 5.2 2.2a7.35 7.35 0 0 1 2.2 5.2c0 4.1-3.3 7.4-7.1 7.4Zm4.1-5.6c-.2-.1-1.3-.7-1.5-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-.8-.3-1.5-.9-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1.1-.2 0-.3 0-.1-.4-1-.6-1.4-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.4.2-.1.2-.6.6-.6 1.5s.6 1.7.7 1.8c.1.1 1.2 1.9 3 2.7 1.8.8 1.8.5 2.1.5.3 0 1-.4 1.1-.7.1-.3.1-.7.1-.7 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.5c-4.9 0-8.8 3.2-8.8 7.6 0 2.7 1.5 5 4 6.4V21l3.2-2.1c.5.1 1 .1 1.6.1 4.9 0 8.8-3.2 8.8-7.6S16.9 2.5 12 2.5Zm4.3 9.9c-.2.5-1 .9-1.4 1-.4.1-.9.1-1.5-.1-.4-.1-.8-.3-1.4-.6-2.4-1-4-3.4-4.1-3.5-.1-.1-1-1.3-1-2.5 0-1.2.6-1.8.8-2 .2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4.2.4.7 1.7.8 1.8.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.4.4c-.1.1-.2.2-.1.4.1.2.5.9 1.1 1.5.8.7 1.4 1 1.6 1.1.2.1.3 0 .4-.1l.6-.7c.1-.2.3-.2.5-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.1.1.6-.1 1.1Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M14.8 3c.3 1.6 1.2 2.9 2.6 3.7 1 .6 2 .9 3.1.9v2.7c-1.4 0-2.8-.4-4-.9v5.1c0 3.2-2.6 5.8-5.8 5.8S4.9 17.7 4.9 14.5s2.6-5.8 5.8-5.8c.3 0 .7 0 1 .1v2.8c-.3-.1-.6-.1-1-.1-1.6 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V3h3.1Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path
        d="M6.9 4.5h2.2c.4 0 .8.3.9.7l.8 3.2a1 1 0 0 1-.3.9l-1.5 1.5a14.7 14.7 0 0 0 4.2 4.2l1.5-1.5a1 1 0 0 1 .9-.3l3.2.8c.4.1.7.5.7.9v2.2c0 .5-.4 1-.9 1C10.7 19.1 4.9 13.3 4.9 5.4c0-.5.5-.9 1-.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
