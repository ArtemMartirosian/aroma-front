import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <TaxonomyManager
      mode="brands"
      entityId={id}
      showItems={false}
      redirectAfterCreate="/admin/brands"
      title="Խմբագրել բրենդը"
      submitLabel="Պահպանել փոփոխությունները"
      backHref="/admin/brands"
      backLabel="Վերադառնալ բրենդներ"
    />
  );
}
