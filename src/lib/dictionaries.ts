import { localeIntl, Locale } from "@/lib/locale-config";
import { FragranceType, Gender, Longevity, Sillage } from "@/types/catalog";

const genderLabelsByLocale: Record<Locale, Record<Gender, string>> = {
  am: { male: "Արական", female: "Իգական", unisex: "Ունիսեքս" },
  ru: { male: "Мужской", female: "Женский", unisex: "Унисекс" },
  en: { male: "Male", female: "Female", unisex: "Unisex" },
};

const fragranceLabelsByLocale: Record<Locale, Record<FragranceType, string>> = {
  am: {
    woody: "Փայտային",
    floral: "Ծաղկային",
    citrus: "Ցիտրուսային",
    oriental: "Արևելյան",
    fresh: "Թարմ",
    sweet: "Քաղցր",
    spicy: "Կծու",
  },
  ru: {
    woody: "Древесный",
    floral: "Цветочный",
    citrus: "Цитрусовый",
    oriental: "Восточный",
    fresh: "Свежий",
    sweet: "Сладкий",
    spicy: "Пряный",
  },
  en: {
    woody: "Woody",
    floral: "Floral",
    citrus: "Citrus",
    oriental: "Oriental",
    fresh: "Fresh",
    sweet: "Sweet",
    spicy: "Spicy",
  },
};

const longevityLabelsByLocale: Record<Locale, Record<Longevity, string>> = {
  am: { low: "Ցածր", medium: "Միջին", high: "Բարձր", very_high: "Շատ բարձր" },
  ru: { low: "Низкая", medium: "Средняя", high: "Высокая", very_high: "Очень высокая" },
  en: { low: "Low", medium: "Medium", high: "High", very_high: "Very high" },
};

const sillageLabelsByLocale: Record<Locale, Record<Sillage, string>> = {
  am: { soft: "Փափուկ", medium: "Միջին", strong: "Ուժեղ", very_strong: "Շատ ուժեղ" },
  ru: { soft: "Мягкий", medium: "Средний", strong: "Сильный", very_strong: "Очень сильный" },
  en: { soft: "Soft", medium: "Medium", strong: "Strong", very_strong: "Very strong" },
};

export function getGenderLabels(locale: Locale = "am") {
  return genderLabelsByLocale[locale];
}

export function getFragranceLabels(locale: Locale = "am") {
  return fragranceLabelsByLocale[locale];
}

export function getLongevityLabels(locale: Locale = "am") {
  return longevityLabelsByLocale[locale];
}

export function getSillageLabels(locale: Locale = "am") {
  return sillageLabelsByLocale[locale];
}

export const genderLabels = getGenderLabels("am");
export const fragranceLabels = getFragranceLabels("am");
export const longevityLabels = getLongevityLabels("am");
export const sillageLabels = getSillageLabels("am");

export const genderOptions = Object.entries(genderLabels);
export const fragranceOptions = Object.entries(fragranceLabels);
export const longevityOptions = Object.entries(longevityLabels);
export const sillageOptions = Object.entries(sillageLabels);

export function getGenderOptions(locale: Locale = "am") {
  return Object.entries(getGenderLabels(locale));
}

export function getFragranceOptions(locale: Locale = "am") {
  return Object.entries(getFragranceLabels(locale));
}

export function getLongevityOptions(locale: Locale = "am") {
  return Object.entries(getLongevityLabels(locale));
}

export function getSillageOptions(locale: Locale = "am") {
  return Object.entries(getSillageLabels(locale));
}

export function formatPrice(value: number | string, locale: Locale = "am") {
  return new Intl.NumberFormat(localeIntl[locale], {
    style: "currency",
    currency: "AMD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
