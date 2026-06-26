"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Գլխավոր", icon: HomeIcon },
  { href: "/catalog", label: "Կատալոգ", icon: CatalogIcon },
  { href: "/brands", label: "Բրենդներ", icon: BrandIcon },
  { href: "/contacts", label: "Կապ", icon: ContactIcon },
];

export function MobileTabBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-between rounded-[28px] border border-[var(--line)] bg-[rgba(14,16,17,0.92)] px-2 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`) || pathname.startsWith(`${tab.href}?`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                isActive
                  ? "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[22px] bg-[var(--accent-soft)] px-2 py-2 text-[var(--accent-strong)]"
                  : "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[22px] px-2 py-2 text-[var(--text-soft)] transition hover:text-[var(--foreground)]"
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate text-[11px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <path
        d="M3.75 8.25 10 3.5l6.25 4.75v7a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1v-7Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M8 16.25v-4.5h4v4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CatalogIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <path
        d="M4.25 5.25h11.5M4.25 10h11.5M4.25 14.75h11.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BrandIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <path
        d="M5 4.75h10a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M7 8.25h6M7 11.75h3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <path
        d="M6.25 4.5h2l1 3.25-1.5 1.5a10.3 10.3 0 0 0 3 3l1.5-1.5 3.25 1v2a1 1 0 0 1-1 1A9.5 9.5 0 0 1 5.25 5.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
