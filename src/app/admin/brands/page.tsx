import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export default function AdminBrandsPage() {
  return (
    <TaxonomyManager
      mode="brands"
      showCreateForm={false}
      createHref="/admin/brands/create"
    />
  );
}
