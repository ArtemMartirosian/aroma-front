import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <TaxonomyManager
      mode="categories"
      entityId={id}
      showItems={false}
      redirectAfterCreate="/admin/categories"
      title="Խմբագրել կատեգորիան"
      submitLabel="Պահպանել փոփոխությունները"
      backHref="/admin/categories"
      backLabel="Վերադառնալ կատեգորիաներ"
    />
  );
}
