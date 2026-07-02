import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function CreateBrandPage() {
  return (
    <TaxonomyManager
      mode="brands"
      showItems={false}
      redirectAfterCreate="/admin/brands"
      backHref="/admin/brands"
    />
  );
}
