import { FragranceType, Gender, Longevity, Sillage } from "@/types/catalog";

export const genderLabels: Record<Gender, string> = {
  male: "Мужской",
  female: "Женский",
  unisex: "Унисекс",
};

export const fragranceLabels: Record<FragranceType, string> = {
  woody: "Древесный",
  floral: "Цветочный",
  citrus: "Цитрусовый",
  oriental: "Восточный",
  fresh: "Свежий",
  sweet: "Сладкий",
  spicy: "Пряный",
};

export const longevityLabels: Record<Longevity, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
  very_high: "Очень высокая",
};

export const sillageLabels: Record<Sillage, string> = {
  soft: "Мягкий",
  medium: "Средний",
  strong: "Сильный",
  very_strong: "Очень сильный",
};

export const genderOptions = Object.entries(genderLabels);
export const fragranceOptions = Object.entries(fragranceLabels);
export const longevityOptions = Object.entries(longevityLabels);
export const sillageOptions = Object.entries(sillageLabels);

export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "AMD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
