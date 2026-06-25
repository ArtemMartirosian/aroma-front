import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function CreateCategoryPage() {
  return (
    <TaxonomyManager
      mode="categories"
      showItems={false}
      redirectAfterCreate="/admin/categories"
      title="Ստեղծել կատեգորիա"
      backHref="/admin/categories"
      backLabel="Վերադառնալ կատեգորիաներ"
    />
  );
}
