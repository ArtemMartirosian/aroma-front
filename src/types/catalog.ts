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
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  price: number | string;
  oldPrice?: number | string;
  volume: string;
  gender: Gender;
  fragranceType: FragranceType;
  description: string;
  shortDescription: string;
  mainImage?: string;
  galleryImages: string[];
  isAvailable: boolean;
  stockStatus: string;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  longevity?: Longevity;
  sillage?: Sillage;
  concentration?: string;
  country?: string;
  releaseYear?: number;
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
  availableProducts: number;
  unavailableProducts: number;
  featuredProducts: number;
  newProducts: number;
  latestProducts: Product[];
};
