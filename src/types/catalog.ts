export type Gender = "male" | "female" | "unisex";
export type FragranceType =
  | "woody"
  | "floral"
  | "citrus"
  | "oriental"
  | "fresh"
  | "sweet"
  | "spicy";
export type Longevity = "low" | "medium" | "high" | "very_high";
export type Sillage = "soft" | "medium" | "strong" | "very_strong";

export type Brand = {
  id: string;
  name: string;
  nameRu?: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  image?: string;
  description?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  productCount?: number;
  isActive: boolean;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  nameRu?: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  isProtected?: boolean;
  isActive: boolean;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductVariant = {
  volume: string;
  price: number | string;
  oldPrice?: number | string;
  images: string[];
};

export type Product = {
  id: string;
  name: string;
  nameRu?: string;
  nameEn?: string;
  slug: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  price: number | string;
  oldPrice?: number | string;
  volume: string;
  gender?: Gender;
  fragranceType?: FragranceType;
  description: string;
  descriptionRu?: string;
  descriptionEn?: string;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  topNotes?: string;
  topNotesRu?: string;
  topNotesEn?: string;
  middleNotes?: string;
  middleNotesRu?: string;
  middleNotesEn?: string;
  baseNotes?: string;
  baseNotesRu?: string;
  baseNotesEn?: string;
  longevity?: Longevity;
  sillage?: Sillage;
  concentration?: string;
  concentrationRu?: string;
  concentrationEn?: string;
  country?: string;
  releaseYear?: number;
  variants?: ProductVariant[];
  relatedProducts?: Product[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsResponse = {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type DashboardStats = {
  totalProducts: number;
  featuredProducts: number;
  newProducts: number;
  latestProducts: Product[];
};
