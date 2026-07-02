import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function AdminCategoriesPage() {
  return (
    <TaxonomyManager
      mode="categories"
      showCreateForm={false}
      createHref="/admin/categories/create"
    />
  );
}
