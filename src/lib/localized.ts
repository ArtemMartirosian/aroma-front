import { Locale } from "@/lib/locale-config";

type LocalizedEntity = Record<string, unknown> | null | undefined;

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getLocalizedField(
  entity: LocalizedEntity,
  baseField: string,
  locale: Locale,
) {
  if (!entity) {
    return "";
  }

  const hyValue = asText(entity[baseField]);
  const ruValue = asText(entity[`${baseField}Ru`]);
  const enValue = asText(entity[`${baseField}En`]);

  if (locale === "ru") {
    return ruValue || hyValue || enValue;
  }

  if (locale === "en") {
    return enValue || hyValue || ruValue;
  }

  return hyValue || ruValue || enValue;
}
