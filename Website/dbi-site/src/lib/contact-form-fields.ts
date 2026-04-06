/** Normalized field from a Contact Form definition (CMS → UI + API validation). */

export type ContactFormFieldType = "text" | "email" | "textarea" | "select";

export type ContactFormFieldDef = {
  name: string;
  fieldType: ContactFormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  selectOptions?: string[];
  rows?: number;
};

const FIELD_TYPES: ContactFormFieldType[] = ["text", "email", "textarea", "select"];

function normalizeFieldType(v: unknown): ContactFormFieldType {
  if (typeof v === "string" && (FIELD_TYPES as readonly string[]).includes(v)) {
    return v as ContactFormFieldType;
  }
  return "text";
}

export function normalizeContactFormFieldDefinitions(
  raw: unknown,
): ContactFormFieldDef[] {
  if (!Array.isArray(raw)) return [];
  const out: ContactFormFieldDef[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) continue;
    const label = typeof o.label === "string" ? o.label.trim() : "";
    if (!label) continue;
    const fieldType = normalizeFieldType(o.fieldType);
    const required = o.required !== false;
    const placeholder =
      typeof o.placeholder === "string" && o.placeholder.trim() !== ""
        ? o.placeholder.trim()
        : undefined;
    let selectOptions: string[] | undefined;
    if (fieldType === "select" && Array.isArray(o.selectOptions)) {
      selectOptions = o.selectOptions
        .filter((x): x is string => typeof x === "string" && x.trim() !== "")
        .map((x) => x.trim());
    }
    let rows: number | undefined;
    if (fieldType === "textarea" && typeof o.rows === "number" && Number.isFinite(o.rows)) {
      rows = Math.min(30, Math.max(2, Math.round(o.rows)));
    }
    out.push({
      name,
      fieldType,
      label,
      placeholder,
      required,
      ...(selectOptions && selectOptions.length ? { selectOptions } : {}),
      ...(rows !== undefined ? { rows } : {}),
    });
  }
  return out;
}

export function isDynamicContactFormDefinition(input: {
  fieldDefinitions?: unknown;
  fields?: unknown;
}): boolean {
  return normalizeContactFormFieldDefinitions(input.fieldDefinitions).length > 0;
}
