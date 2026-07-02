import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function CreateCategoryPage() {
  return (
    <TaxonomyManager
      mode="categories"
      showItems={false}
      redirectAfterCreate="/admin/categories"
      backHref="/admin/categories"
    />
  );
}
