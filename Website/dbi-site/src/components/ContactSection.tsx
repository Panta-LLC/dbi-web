"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/Container";
import { ContactFormFields } from "@/components/cta-modal-form/ContactFormFields";
import { resolveContactMessagePlaceholder } from "@/components/cta-modal-form/messagePlaceholder";
import { Section } from "@/components/Section";
import {
  isDynamicContactFormDefinition,
  normalizeContactFormFieldDefinitions,
  type ContactFormFieldDef,
} from "@/lib/contact-form-fields";
import {
  contactFormPlaceholdersFromSanity,
  type SanityContactFormDefinitionRef,
  type SanityContactFormPreset,
} from "@/lib/sanity-cta-action";

type GeneralConfig = {
  listLabel: string;
  formId: string;
  messageContext?: string;
  modalTitle?: string;
  modalDescription?: string;
  successMessage?: string;
  contactFormDefinition: SanityContactFormDefinitionRef | null | undefined;
};

type ActiveFormConfig =
  | {
      mode: "legacy";
      formId: string;
      triggerLabel: string;
      messageContext?: string;
      modalTitle?: string;
      modalDescription?: string;
      successMessage?: string;
      legacyContactForm: NonNullable<SanityContactFormDefinitionRef["fields"]>;
      submitLabel: string;
    }
  | {
      mode: "dynamic";
      formId: string;
      triggerLabel: string;
      messageContext?: string;
      modalTitle?: string;
      modalDescription?: string;
      successMessage?: string;
      contactFormDefinitionId: string;
      dynamicFields: ContactFormFieldDef[];
      submitLabel: string;
    };

function resolveDefinitionToActive(
  definition: SanityContactFormDefinitionRef | null | undefined,
  formId: string,
  triggerLabel: string,
  messageContext?: string,
  modalTitle?: string,
  modalDescription?: string,
  successMessage?: string,
): ActiveFormConfig | null {
  if (!definition) return null;

  if (isDynamicContactFormDefinition(definition) && definition._id) {
    const defs = normalizeContactFormFieldDefinitions(definition.fieldDefinitions);
    const submitLabel = definition.submitLabel?.trim() || "";
    if (defs.length === 0 || !submitLabel) return null;
    return {
      mode: "dynamic",
      formId,
      triggerLabel,
      messageContext,
      modalTitle,
      modalDescription,
      successMessage,
      contactFormDefinitionId: definition._id,
      dynamicFields: defs,
      submitLabel,
    };
  }

  const legacy = definition.fields;
  if (!legacy) return null;
  return {
    mode: "legacy",
    formId,
    triggerLabel,
    messageContext,
    modalTitle,
    modalDescription,
    successMessage,
    legacyContactForm: legacy,
    submitLabel: legacy.submitLabel?.trim() || "Send",
  };
}

export type ContactSectionProps = {
  title?: string;
  contactIntro?: string;
  general: GeneralConfig;
  ctaPresets: SanityContactFormPreset[];
};

function normalizeHashFragment(hash: string): string {
  if (!hash || hash === "#") return "";
  const rest = hash.startsWith("#") ? hash.slice(1) : hash;
  try {
    return decodeURIComponent(rest.trim());
  } catch {
    return rest.trim();
  }
}

function selectionFromHash(
  fragment: string,
  generalFormId: string,
  presets: SanityContactFormPreset[],
): "general" | string | null {
  if (!fragment) return null;
  const g = generalFormId.trim();
  if (fragment === g || fragment === "general") return "general";
  const preset = presets.find((p) => (p.formId ?? "").trim() === fragment);
  if (preset?._id) return preset._id;
  return null;
}

function replaceContactHash(formId: string) {
  if (typeof window === "undefined") return;
  const id = formId.trim();
  if (!id) return;
  const url = `${window.location.pathname}${window.location.search}#${encodeURIComponent(id)}`;
  window.history.replaceState(null, "", url);
}

function presetUsable(p: SanityContactFormPreset | null | undefined): boolean {
  if (!p?._id || !p.formId?.trim()) return false;
  const def = p.contactFormDefinition;
  if (!def) return false;
  if (isDynamicContactFormDefinition(def)) {
    const defs = normalizeContactFormFieldDefinitions(def.fieldDefinitions);
    return (
      defs.length > 0 &&
      Boolean(def._id && def.submitLabel?.trim()) &&
      Boolean(p.listLabel?.trim() || p.label?.trim())
    );
  }
  if (def.fields) {
    return Boolean(p.listLabel?.trim() || p.label?.trim());
  }
  return false;
}

export function ContactSection({ title, contactIntro, general, ctaPresets }: ContactSectionProps) {
  const usablePresets = useMemo(() => ctaPresets.filter(presetUsable), [ctaPresets]);

  const [selected, setSelected] = useState<"general" | string>("general");
  const articlePanelRef = useRef<HTMLElement | null>(null);
  const prevSelectionForScrollRef = useRef<"general" | string | undefined>(undefined);

  useEffect(() => {
    const applyHash = () => {
      const fragment = normalizeHashFragment(
        typeof window !== "undefined" ? window.location.hash : "",
      );
      if (!fragment) return;
      const next = selectionFromHash(fragment, general.formId, usablePresets);
      if (next === null) return;
      setSelected(next);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [general.formId, usablePresets]);

  const resolvedSelection = useMemo((): "general" | string => {
    if (selected !== "general" && !usablePresets.some((p) => p._id === selected)) {
      return "general";
    }
    return selected;
  }, [selected, usablePresets]);

  /** Scroll the form panel to the top when the user picks another form (or hash changes selection). */
  useLayoutEffect(() => {
    if (prevSelectionForScrollRef.current === undefined) {
      prevSelectionForScrollRef.current = resolvedSelection;
      return;
    }
    if (prevSelectionForScrollRef.current === resolvedSelection) return;
    prevSelectionForScrollRef.current = resolvedSelection;
    requestAnimationFrame(() => {
      articlePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [resolvedSelection]);

  const activeForm = useMemo((): ActiveFormConfig | null => {
    if (resolvedSelection !== "general") {
      const preset = usablePresets.find((p) => p._id === resolvedSelection);
      if (preset) {
        const triggerLabel = preset.listLabel?.trim() || preset.label?.trim() || "";
        const def = preset.contactFormDefinition;
        return resolveDefinitionToActive(
          def,
          (preset.formId ?? "").trim(),
          triggerLabel,
          preset.messageContext ?? undefined,
          preset.modalTitle ?? undefined,
          preset.modalDescription ?? undefined,
          preset.successMessage ?? undefined,
        );
      }
    }
    return resolveDefinitionToActive(
      general.contactFormDefinition,
      general.formId,
      general.listLabel,
      general.messageContext,
      general.modalTitle,
      general.modalDescription,
      general.successMessage,
    );
  }, [resolvedSelection, usablePresets, general]);

  const mergedLegacyPlaceholders = useMemo(() => {
    if (!activeForm || activeForm.mode !== "legacy") return undefined;
    const ph = contactFormPlaceholdersFromSanity(activeForm.legacyContactForm);
    return {
      ...ph,
      message: resolveContactMessagePlaceholder(
        activeForm.triggerLabel,
        activeForm.messageContext,
        ph.message,
      ),
    };
  }, [activeForm]);

  if (!activeForm) {
    return null;
  }

  const hasFormHeader =
    Boolean(activeForm.modalTitle?.trim()) || Boolean(activeForm.modalDescription?.trim());

  return (
    <Section className="bg-white section-block-gap max-w-6xl m-auto">
      <div className="my-10 pl-4">
        {/* {title?.trim() ? <h2 className="heading-2 mt-10 text-center">{title.trim()}</h2> : null}
        {contactIntro?.trim() ? (
          <Container maxWidth="narrow" className="mt-6 mb-4 text-center">
            <p className="body-md whitespace-pre-line text-slate-600">{contactIntro.trim()}</p>
          </Container>
        ) : null} */}

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-0">
          <div
            className="relative z-50 flex flex-col gap-2 overflow-x-visible lg:sticky lg:top-25 lg:col-span-5 lg:max-h-[calc(100vh-5.5rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
            role="listbox"
            aria-label={title?.trim() || "Choose a contact form"}
          >
            <CtaListButton
              selected={resolvedSelection === "general"}
              onClick={() => {
                setSelected("general");
                replaceContactHash(general.formId);
              }}
            >
              {general.listLabel}
            </CtaListButton>
            {usablePresets.map((p) => {
              const id = p._id!;
              const label = p.listLabel?.trim() || p.label?.trim() || "Contact";
              const desc = p.listDescription?.trim();
              const fid = (p.formId ?? "").trim();
              return (
                <CtaListButton
                  key={id}
                  selected={resolvedSelection === id}
                  onClick={() => {
                    setSelected(id);
                    if (fid) replaceContactHash(fid);
                  }}
                  description={desc}
                >
                  {label}
                </CtaListButton>
              );
            })}
          </div>

          <div className="relative min-h-48 min-w-0 overflow-x-hidden lg:col-span-7">
            <article
              ref={articlePanelRef}
              key={resolvedSelection}
              id={activeForm.formId}
              className="collection-explorer-article-panel collection-article-scroll-target relative"
            >
              <div className="relative px-4 pb-10 pt-10 sm:px-6 sm:pt-0 lg:px-8 lg:pr-12">
                {activeForm.modalTitle?.trim() ? (
                  <h3 className="display-s text-[var(--color-4)]">
                    {activeForm.modalTitle.trim()}
                  </h3>
                ) : null}
                {activeForm.modalDescription?.trim() ? (
                  <p className="body-md mt-4 whitespace-pre-line text-[var(--color-5)]">
                    {activeForm.modalDescription.trim()}
                  </p>
                ) : null}
                <div className={hasFormHeader ? "mt-6" : ""}>
                  {activeForm.mode === "dynamic" ? (
                    <ContactFormFields
                      formId={activeForm.formId}
                      triggerLabel={activeForm.triggerLabel}
                      messageContext={activeForm.messageContext}
                      submitLabel={activeForm.submitLabel}
                      successMessage={activeForm.successMessage}
                      contactFormDefinitionId={activeForm.contactFormDefinitionId}
                      dynamicFields={activeForm.dynamicFields}
                    />
                  ) : mergedLegacyPlaceholders ? (
                    <ContactFormFields
                      formId={activeForm.formId}
                      triggerLabel={activeForm.triggerLabel}
                      messageContext={activeForm.messageContext}
                      placeholders={mergedLegacyPlaceholders}
                      submitLabel={activeForm.submitLabel}
                      successMessage={activeForm.successMessage}
                    />
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Matches CollectionArticleSection explorer sidebar list rows (PreviewBlock variant sidebar). */
function ExplorerListActiveTab() {
  return (
    <div
      className="absolute top-0 right-[-13px] bottom-0 z-50 m-auto hidden shrink-0 self-stretch lg:flex"
      aria-hidden
    >
      <span className="absolute top-0 right-[-4px] bottom-0 m-auto h-0 w-0 border-y-[16px] border-l-[14px] border-y-transparent border-l-[var(--color-3)] sm:border-y-[16px] sm:border-l-[14px]" />
      <span className="absolute top-0 right-[4px] bottom-0 m-auto h-0 w-0 border-y-[14px] border-l-[12px] border-y-transparent border-l-[var(--color-4)] sm:border-y-[16px] sm:border-l-[14px]" />
    </div>
  );
}

function CtaListButton({
  selected,
  onClick,
  children,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  description?: string;
}) {
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-2)] focus-visible:ring-inset";

  if (selected) {
    return (
      <button
        type="button"
        role="option"
        aria-selected
        onClick={onClick}
        className={`relative w-full cursor-pointer rounded-none border-0 text-left shadow-none ${focusRing}`}
      >
        <div className="flex min-h-0 w-full items-stretch">
          <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-0">
            <div className="relative flex min-w-0 flex-1 flex-col justify-start bg-[var(--color-4)] px-8 py-8 text-[var(--color-3)]">
              <span className="heading-3 text-[var(--color-3)]">{children}</span>
              {description ? (
                <span className="mt-1 block text-sm whitespace-pre-line text-[var(--color-3)]/95">
                  {description}
                </span>
              ) : null}
              <ExplorerListActiveTab />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={false}
      onClick={onClick}
      className={`relative w-full cursor-pointer rounded-none border-0 text-left shadow-none ${focusRing}`}
    >
      <div
        className={`flex min-h-0 flex-col items-stretch justify-center bg-[var(--color-3)] px-8 py-6`}
      >
        <div className="flex w-full min-w-0 flex-1 flex-col justify-start">
          <span className="heading-3 text-[var(--color-4)]">{children}</span>
          {description ? (
            <span className="mt-1 block text-sm whitespace-pre-line text-[var(--color-5)]">
              {description}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
