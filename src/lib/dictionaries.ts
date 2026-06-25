import { FragranceType, Gender, Longevity, Sillage } from "@/types/catalog";

export const genderLabels: Record<Gender, string> = {
  male: "Արական",
  female: "Իգական",
  unisex: "Ունիսեքս",
};

export const fragranceLabels: Record<FragranceType, string> = {
  woody: "Փայտային",
  floral: "Ծաղկային",
  citrus: "Ցիտրուսային",
  oriental: "Արևելյան",
  fresh: "Թարմ",
  sweet: "Քաղցր",
  spicy: "Կծու",
};

export const longevityLabels: Record<Longevity, string> = {
  low: "Ցածր",
  medium: "Միջին",
  high: "Բարձր",
  very_high: "Շատ բարձր",
};

export const sillageLabels: Record<Sillage, string> = {
  soft: "Փափուկ",
  medium: "Միջին",
  strong: "Ուժեղ",
  very_strong: "Շատ ուժեղ",
};

export const genderOptions = Object.entries(genderLabels);
export const fragranceOptions = Object.entries(fragranceLabels);
export const longevityOptions = Object.entries(longevityLabels);
export const sillageOptions = Object.entries(sillageLabels);

export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("hy-AM", {
    style: "currency",
    currency: "AMD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
