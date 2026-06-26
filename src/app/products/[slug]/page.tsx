import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/catalog/ProductDetails";
import { ProductCard } from "@/components/catalog/ProductCard";
import { API_URL } from "@/lib/api";
import { longevityLabels, sillageLabels } from "@/lib/dictionaries";
import { Product } from "@/types/catalog";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const related = product.relatedProducts?.slice(0, 3) ?? [];

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetails product={product} />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Բույրի նոտաներ</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Բույրի բուրգ</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <NoteCard label="Վերին նոտաներ" value={product.topNotes || "Նշված չէ"} />
              <NoteCard label="Միջին նոտաներ" value={product.middleNotes || "Նշված չէ"} />
              <NoteCard label="Բազային նոտաներ" value={product.baseNotes || "Նշված չէ"} />
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Մանրամասներ</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Բնութագրեր</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Երկարակեցություն" value={product.longevity ? longevityLabels[product.longevity] : "Միջին"} />
              <Info label="Շլեյֆ" value={product.sillage ? sillageLabels[product.sillage] : "Միջին"} />
              <Info label="Երկիր" value={product.country || "France"} />
              <Info label="Տարի" value={product.releaseYear ? String(product.releaseYear) : "Նշված չէ"} />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Ձեզ կարող է դուր գալ նաև</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Նման ապրանքներ</h2>
            </div>
          </div>
          {related.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-[var(--surface-elevated)] p-10 text-center text-[var(--text-muted)]">
              Նման ապրանքները դեռ չեն բեռնվել backend-ից։
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

async function loadProduct(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (response.ok) {
      return response.json();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface-muted)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function NoteCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7 text-[var(--foreground)]">{value}</p>
    </div>
  );
}
