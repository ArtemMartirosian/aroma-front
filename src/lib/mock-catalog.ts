import { Brand, Category, Product, ProductVariant, ProductsResponse } from "@/types/catalog";

type MockProductSeed = Omit<Product, "brand" | "category" | "relatedProducts">;

const mockCategoriesBase: Category[] = [
  {
    id: "cat-female",
    name: "Կանացի օծանելիք",
    slug: "female-fragrances",
    description: "Նուրբ ծաղկային, մրգային և էլեգանտ կոմպոզիցիաներ ամեն օրվա ու երեկոյի համար։",
    isActive: true,
  },
  {
    id: "cat-male",
    name: "Տղամարդու օծանելիք",
    slug: "male-fragrances",
    description: "Փայտային, կծու և թարմ բույրեր ուժեղ ու հավաքված ներկայության համար։",
    isActive: true,
  },
  {
    id: "cat-unisex",
    name: "Ունիսեքս",
    slug: "unisex-fragrances",
    description: "Ժամանակակից բույրեր առանց խիստ բաժանման՝ մաքուր, հարուստ և հիշվող շլեյֆով։",
    isActive: true,
  },
  {
    id: "cat-niche",
    name: "Նիշային բույրեր",
    slug: "niche-fragrances",
    description: "Բարդ և արտահայտիչ կոմպոզիցիաներ նրանց համար, ովքեր ուզում են տարբերվել։",
    isActive: true,
  },
  {
    id: "cat-cosmetics",
    name: "Կոսմետիկա",
    slug: "cosmetics",
    description: "Խնամքի և գեղեցկության ընտրված միջոցներ ամենօրյա ռեժիմի համար։",
    isActive: true,
  },
  {
    id: "cat-accessoires",
    name: "Աքսեսուարներ",
    slug: "accessoires",
    description: "Գեղեցկության և պահեստավորման էլեգանտ աքսեսուարներ՝ հարմար օգտագործման համար։",
    isActive: true,
  },
];

const mockBrandsBase: Brand[] = [
  {
    id: "brand-chanel",
    name: "Chanel",
    slug: "chanel",
    logo: "CH",
    image: "/images/products/perfume-card-1.png",
    description: "Ֆրանսիական դասական՝ նուրբ էլեգանտությամբ, մաքուր գծերով և հավասարակշռված շլեյֆով։",
    isActive: true,
  },
  {
    id: "brand-dior",
    name: "Dior",
    slug: "dior",
    logo: "DI",
    image: "/images/perfume-hero-men-1.png",
    description: "Ժամանակակից լյուքս բույրեր՝ վառ բնավորությամբ, խորությամբ և վստահ ներկայությամբ։",
    isActive: true,
  },
  {
    id: "brand-tom-ford",
    name: "Tom Ford",
    slug: "tom-ford",
    logo: "TF",
    image: "/images/perfume-hero-men-2.png",
    description: "Համարձակ, մուգ և շքեղ կոմպոզիցիաներ՝ ընդգծված փայտային ու արևելյան շեշտերով։",
    isActive: true,
  },
  {
    id: "brand-byredo",
    name: "Byredo",
    slug: "byredo",
    logo: "BY",
    image: "/images/products/perfume-card-4.png",
    description: "Նիշային տրամադրություն՝ մաքուր, օդային և շատ ժամանակակից բույրային պատմություններով։",
    isActive: true,
  },
  {
    id: "brand-mfk",
    name: "Maison Francis Kurkdjian",
    slug: "maison-francis-kurkdjian",
    logo: "MF",
    image: "/images/products/perfume-card-5.png",
    description: "Բարձր պերֆյումերիա՝ հարուստ շերտերով, թանկ հնչողությամբ և հիշվող աուրայով։",
    isActive: true,
  },
  {
    id: "brand-ysl",
    name: "Yves Saint Laurent",
    slug: "yves-saint-laurent",
    logo: "YL",
    image: "/images/perfume-hero-women.png",
    description: "Սուր ոճ, նորաձեւ տրամադրություն և էլեգանտ բույրեր՝ ցերեկից մինչև երեկո։",
    isActive: true,
  },
];

const mockProductSeeds: MockProductSeed[] = [
  {
    id: "product-chanel-coco-mademoiselle",
    name: "Chanel Coco Mademoiselle Eau de Parfum",
    slug: "chanel-coco-mademoiselle-eau-de-parfum",
    brandId: "brand-chanel",
    categoryId: "cat-female",
    price: 42000,
    oldPrice: 48000,
    volume: "35ml",
    gender: "female",
    fragranceType: "floral",
    description: "Թեթև ցիտրուսային բացումով և նուրբ պաչուլի-վարդային սրտով բույր, որը հնչում է մաքուր, կանացի և շատ հավաքված։",
    shortDescription: "Կանացի, էլեգանտ և ժամանակակից ֆրանսիական դասական։",
    isFeatured: true,
    isNew: false,
    isActive: true,
    topNotes: "Նարնջի կեղև, բերգամոտ",
    middleNotes: "Վարդ, հասմիկ",
    baseNotes: "Պաչուլի, սպիտակ մուշկ, վանիլ",
    longevity: "high",
    sillage: "strong",
    concentration: "Eau de Parfum",
    country: "France",
    releaseYear: 2001,
    variants: [
      {
        volume: "35ml",
        price: 42000,
        oldPrice: 48000,
        images: ["/images/products/perfume-card-1.png", "/images/perfume-hero-women.png"],
      },
      {
        volume: "50ml",
        price: 56000,
        oldPrice: 62000,
        images: ["/images/products/perfume-card-2.png", "/images/products/perfume-card-1.png"],
      },
      {
        volume: "100ml",
        price: 88000,
        oldPrice: 96000,
        images: ["/images/products/perfume-card-3.png", "/images/perfume-hero-women.png"],
      },
    ],
  },
  {
    id: "product-dior-sauvage-elixir",
    name: "Dior Sauvage Elixir",
    slug: "dior-sauvage-elixir",
    brandId: "brand-dior",
    categoryId: "cat-male",
    price: 46000,
    oldPrice: 52000,
    volume: "60ml",
    gender: "male",
    fragranceType: "spicy",
    description: "Հագեցած կծու և փայտային կոմպոզիցիա՝ թարմ բացումով ու խորը տաք հիմքով։ Համարձակ և երկարատև տարբերակ ամեն օրվա համար։",
    shortDescription: "Խորը, ուժեղ և ժամանակակից արական բույր։",
    isFeatured: true,
    isNew: true,
    isActive: true,
    topNotes: "Դարչին, գրեյպֆրուտ, մշկընկույզ",
    middleNotes: "Լավանդա",
    baseNotes: "Սաթ, լիկյորային փայտ, պաչուլի",
    longevity: "very_high",
    sillage: "very_strong",
    concentration: "Elixir",
    country: "France",
    releaseYear: 2021,
    variants: [
      {
        volume: "60ml",
        price: 46000,
        oldPrice: 52000,
        images: ["/images/perfume-hero-men-1.png", "/images/perfume-hero-men-2.png"],
      },
      {
        volume: "100ml",
        price: 69000,
        oldPrice: 76000,
        images: ["/images/perfume-hero-men-2.png", "/images/perfume-hero-men-1.png"],
      },
    ],
  },
  {
    id: "product-tom-ford-oud-wood",
    name: "Tom Ford Oud Wood",
    slug: "tom-ford-oud-wood",
    brandId: "brand-tom-ford",
    categoryId: "cat-unisex",
    price: 64000,
    oldPrice: 72000,
    volume: "50ml",
    gender: "unisex",
    fragranceType: "woody",
    description: "Մուգ, թանկ և շատ շքեղ փայտային բույր՝ ուդի, սանդալի ու տաք համեմունքների խորությամբ։",
    shortDescription: "Շքեղ փայտային ունիսեքս՝ մուգ տրամադրությամբ։",
    isFeatured: true,
    isNew: false,
    isActive: true,
    topNotes: "Էլայչի, վարդագույն պղպեղ",
    middleNotes: "Ուդ, սանդալ",
    baseNotes: "Սաթ, վետիվեր, տոնկա",
    longevity: "high",
    sillage: "strong",
    concentration: "Eau de Parfum",
    country: "USA",
    releaseYear: 2007,
    variants: [
      {
        volume: "50ml",
        price: 64000,
        oldPrice: 72000,
        images: ["/images/perfume-hero-men-2.png", "/images/perfume-hero-men-1.png"],
      },
      {
        volume: "100ml",
        price: 94000,
        oldPrice: 102000,
        images: ["/images/perfume-hero-men-1.png", "/images/products/perfume-card-6.png"],
      },
    ],
  },
  {
    id: "product-byredo-gypsy-water",
    name: "Byredo Gypsy Water Eau de Parfum",
    slug: "byredo-gypsy-water-eau-de-parfum",
    brandId: "brand-byredo",
    categoryId: "cat-unisex",
    price: 37800,
    oldPrice: 43000,
    volume: "50ml",
    gender: "unisex",
    fragranceType: "fresh",
    description: "Թարմ, մաքուր և օդային կոմպոզիցիա՝ ցիտրուսային բացումով, փափուկ փայտային սրտով և շատ կոկիկ ավարտով։",
    shortDescription: "Թարմ ունիսեքս՝ մաքուր ու նուրբ շլեյֆով։",
    isFeatured: false,
    isNew: true,
    isActive: true,
    topNotes: "Բերգամոտ, լիմոն, գիհի",
    middleNotes: "Խունկ, սոճու ասեղներ",
    baseNotes: "Սանդալ, վանիլ, սաթ",
    longevity: "medium",
    sillage: "medium",
    concentration: "Eau de Parfum",
    country: "Sweden",
    releaseYear: 2008,
    variants: [
      {
        volume: "50ml",
        price: 37800,
        oldPrice: 43000,
        images: ["/images/products/perfume-card-4.png", "/images/products/perfume-card-5.png"],
      },
      {
        volume: "100ml",
        price: 61200,
        oldPrice: 69000,
        images: ["/images/products/perfume-card-5.png", "/images/products/perfume-card-4.png"],
      },
    ],
  },
  {
    id: "product-mfk-baccarat-rouge-540",
    name: "Maison Francis Kurkdjian Baccarat Rouge 540",
    slug: "maison-francis-kurkdjian-baccarat-rouge-540",
    brandId: "brand-mfk",
    categoryId: "cat-niche",
    price: 72000,
    oldPrice: 81000,
    volume: "35ml",
    gender: "unisex",
    fragranceType: "sweet",
    description: "Ամբրային-քաղցր նիշային բույր՝ շաքարային շողքով, թեթև ծխախոտային-փայտային խորությամբ և շատ հարուստ աուրայով։",
    shortDescription: "Պաշտամունքային նիշային բույր՝ հարուստ ու ճանաչելի։",
    isFeatured: true,
    isNew: true,
    isActive: true,
    topNotes: "Զաֆրան, հասմիկ",
    middleNotes: "Ամբերգրիս",
    baseNotes: "Մայրու փայտ, խեժ",
    longevity: "very_high",
    sillage: "very_strong",
    concentration: "Eau de Parfum",
    country: "France",
    releaseYear: 2015,
    variants: [
      {
        volume: "35ml",
        price: 72000,
        oldPrice: 81000,
        images: ["/images/products/perfume-card-5.png", "/images/products/perfume-card-6.png"],
      },
      {
        volume: "70ml",
        price: 118000,
        oldPrice: 127000,
        images: ["/images/products/perfume-card-6.png", "/images/products/perfume-card-5.png"],
      },
    ],
  },
  {
    id: "product-ysl-libre",
    name: "Yves Saint Laurent Libre Eau de Parfum",
    slug: "yves-saint-laurent-libre-eau-de-parfum",
    brandId: "brand-ysl",
    categoryId: "cat-female",
    price: 44600,
    oldPrice: 49800,
    volume: "30ml",
    gender: "female",
    fragranceType: "floral",
    description: "Լավանդայի, հասմիկի և վանիլի գեղեցիկ հավասարակշռություն՝ շատ կանացի, մաքուր և վստահ տրամադրությամբ։",
    shortDescription: "Ժամանակակից կանացի բույր՝ մաքուր ու էլեգանտ։",
    isFeatured: false,
    isNew: true,
    isActive: true,
    topNotes: "Մանդարին, լավանդա",
    middleNotes: "Հասմիկ, նարնջենու ծաղիկ",
    baseNotes: "Վանիլ, մուշկ, մայրու փայտ",
    longevity: "high",
    sillage: "strong",
    concentration: "Eau de Parfum",
    country: "France",
    releaseYear: 2019,
    variants: [
      {
        volume: "30ml",
        price: 44600,
        oldPrice: 49800,
        images: ["/images/products/perfume-card-2.png", "/images/perfume-hero-women.png"],
      },
      {
        volume: "50ml",
        price: 59800,
        oldPrice: 66000,
        images: ["/images/products/perfume-card-3.png", "/images/products/perfume-card-2.png"],
      },
      {
        volume: "90ml",
        price: 84600,
        oldPrice: 92000,
        images: ["/images/perfume-hero-women.png", "/images/products/perfume-card-3.png"],
      },
    ],
  },
  {
    id: "product-creed-aventus",
    name: "Creed Aventus Eau de Parfum",
    slug: "creed-aventus-eau-de-parfum",
    brandId: "brand-mfk",
    categoryId: "cat-male",
    price: 93000,
    oldPrice: 102000,
    volume: "50ml",
    gender: "male",
    fragranceType: "fresh",
    description: "Հյութեղ մրգային բացումով, ծխային-փայտային սրտով և վստահ, ամուր արական շլեյֆով հայտնի բույր։",
    shortDescription: "Պրեմիում արական բույր՝ թարմ բացումով և ուժեղ հիմքով։",
    isFeatured: true,
    isNew: false,
    isActive: true,
    topNotes: "Արքայախնձոր, սև հաղարջ, բերգամոտ",
    middleNotes: "Կեչի, պաչուլի, հասմիկ",
    baseNotes: "Կաղնու մամուռ, մուշկ, վանիլ",
    longevity: "very_high",
    sillage: "strong",
    concentration: "Eau de Parfum",
    country: "France",
    releaseYear: 2010,
    variants: [
      {
        volume: "50ml",
        price: 93000,
        oldPrice: 102000,
        images: ["/images/perfume-hero-men-1.png", "/images/products/perfume-card-6.png"],
      },
      {
        volume: "100ml",
        price: 149000,
        oldPrice: 158000,
        images: ["/images/perfume-hero-men-2.png", "/images/perfume-hero-men-1.png"],
      },
    ],
  },
  {
    id: "product-chanel-hydra-beauty-cream",
    name: "Chanel Hydra Beauty Cream",
    slug: "chanel-hydra-beauty-cream",
    brandId: "brand-chanel",
    categoryId: "cat-cosmetics",
    price: 34800,
    oldPrice: 39000,
    volume: "50ml",
    gender: "female",
    description: "Խոնավեցնող դեմքի քսուք՝ թեթև հյուսվածքով, հարմար ամենօրյա խնամքի համար և գեղեցիկ, խնամված տեսքի զգացողությամբ։",
    shortDescription: "Լյուքս խոնավեցնող քսուք՝ նուրբ ամենօրյա խնամքի համար։",
    isFeatured: false,
    isNew: true,
    isActive: true,
    country: "France",
    releaseYear: 2024,
    variants: [
      {
        volume: "50ml",
        price: 34800,
        oldPrice: 39000,
        images: ["/images/products/perfume-card-2.png", "/images/products/perfume-card-3.png"],
      },
      {
        volume: "100ml",
        price: 61200,
        oldPrice: 68000,
        images: ["/images/products/perfume-card-3.png", "/images/products/perfume-card-2.png"],
      },
    ],
  },
  {
    id: "product-dior-lip-glow-oil",
    name: "Dior Lip Glow Oil",
    slug: "dior-lip-glow-oil",
    brandId: "brand-dior",
    categoryId: "cat-cosmetics",
    price: 19600,
    oldPrice: 22400,
    volume: "1pc",
    gender: "female",
    description: "Շուրթերի խնամքի փայլ՝ փափուկ խնամքով, նուրբ փայլով և հարմար ամենօրյա beauty աքսենտի համար։",
    shortDescription: "Խնամող շուրթերի փայլ՝ թեթև ու գեղեցիկ ավարտով։",
    isFeatured: true,
    isNew: true,
    isActive: true,
    country: "France",
    releaseYear: 2024,
    variants: [
      {
        volume: "1pc",
        price: 19600,
        oldPrice: 22400,
        images: ["/images/products/perfume-card-4.png", "/images/products/perfume-card-2.png"],
      },
    ],
  },
  {
    id: "product-tom-ford-travel-case",
    name: "Tom Ford Travel Case",
    slug: "tom-ford-travel-case",
    brandId: "brand-tom-ford",
    categoryId: "cat-accessoires",
    price: 28400,
    oldPrice: 31800,
    volume: "1pc",
    gender: "unisex",
    description: "Էլեգանտ travel case՝ parfume կամ beauty essentials-ը հարմար և անվտանգ պահելու համար։",
    shortDescription: "Պրեմիում ճանապարհային աքսեսուար՝ գեղեցիկ և գործնական։",
    isFeatured: false,
    isNew: true,
    isActive: true,
    country: "USA",
    releaseYear: 2024,
    variants: [
      {
        volume: "1pc",
        price: 28400,
        oldPrice: 31800,
        images: ["/images/products/perfume-card-6.png", "/images/perfume-hero-men-2.png"],
      },
    ],
  },
  {
    id: "product-byredo-vanity-pouch",
    name: "Byredo Vanity Pouch",
    slug: "byredo-vanity-pouch",
    brandId: "brand-byredo",
    categoryId: "cat-accessoires",
    price: 22800,
    oldPrice: 25900,
    volume: "1pc",
    gender: "unisex",
    description: "Մինիմալիստական pouch՝ cosmetics և փոքր աքսեսուարները կոկիկ պահելու ու ճանապարհին հետդ վերցնելու համար։",
    shortDescription: "Նրբագեղ vanity pouch՝ cosmetics-ի և accessories-ի համար։",
    isFeatured: true,
    isNew: false,
    isActive: true,
    country: "Sweden",
    releaseYear: 2023,
    variants: [
      {
        volume: "1pc",
        price: 22800,
        oldPrice: 25900,
        images: ["/images/products/perfume-card-5.png", "/images/products/perfume-card-6.png"],
      },
    ],
  },
];

function createCatalogState() {
  const categories = mockCategoriesBase.map((category) => ({ ...category }));
  const brands = mockBrandsBase.map((brand) => ({ ...brand }));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));

  const products = mockProductSeeds.map((product) => ({
    ...product,
    variants: product.variants?.map((variant) => ({ ...variant })) as ProductVariant[] | undefined,
    brand: brandsById.get(product.brandId),
    category: categoriesById.get(product.categoryId),
  })) as Product[];

  const productCountByBrand = new Map<string, number>();
  products.forEach((product) => {
    productCountByBrand.set(product.brandId, (productCountByBrand.get(product.brandId) ?? 0) + 1);
  });

  const brandsWithCounts = brands.map((brand) => ({
    ...brand,
    productCount: productCountByBrand.get(brand.id) ?? 0,
  }));

  return { categories, brands: brandsWithCounts, products };
}

export function getMockCategories() {
  return createCatalogState().categories;
}

export function getMockBrands() {
  return createCatalogState().brands;
}

export function getMockProducts() {
  return createCatalogState().products;
}

export function getMockProductsResponse(limit = 100): ProductsResponse {
  const items = getMockProducts().slice(0, limit);
  return {
    items,
    meta: {
      total: items.length,
      page: 1,
      limit,
      totalPages: 1,
    },
  };
}

export function getMockProductBySlug(slug: string): Product | undefined {
  const products = getMockProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    return undefined;
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id && (item.brandId === product.brandId || item.categoryId === product.categoryId))
    .slice(0, 3)
    .map((item) => ({ ...item, relatedProducts: undefined }));

  return {
    ...product,
    relatedProducts,
  };
}
