import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function CreateBrandPage() {
  return (
    <TaxonomyManager
      mode="brands"
      showItems={false}
      redirectAfterCreate="/admin/brands"
      title="Ստեղծել բրենդ"
      backHref="/admin/brands"
      backLabel="Վերադառնալ բրենդներ"
    />
  );
}
