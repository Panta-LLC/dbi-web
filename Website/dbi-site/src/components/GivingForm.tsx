"use client";

import { useId, useState } from "react";
import { Button } from "@/components/Button";

export type GivingFrequency = "monthly" | "one-time";

export type GivingTier = {
  amount: number;
  impact?: string;
};

export type BuildDonateHrefArgs = {
  url: string;
  frequency: GivingFrequency;
  /** `null` when no valid amount is selected. */
  amount: number | null;
};

type GivingFormProps = {
  title: string;
  description: string;
  /** Network for Good donation page. */
  donateUrl: string;
  /** Separate Network for Good page for recurring gifts. Monthly donors use `donateUrl` when omitted. */
  monthlyDonateUrl?: string;
  /**
   * Hook for appending prefill params. The default returns `url` unchanged: it is unconfirmed
   * whether Network for Good forms accept amount or frequency URL params.
   */
  buildDonateHref?: (args: BuildDonateHrefArgs) => string;
  defaultFrequency?: GivingFrequency;
  monthlyTiers: GivingTier[];
  oneTimeTiers: GivingTier[];
  defaultTierIndex?: number;
  footnote?: string;
};

const DEFAULT_FOOTNOTE =
  "You'll finish your gift securely on Network for Good. Delta Bay Impact is a 501(c)(3) nonprofit; gifts are tax-deductible as allowed by law.";

const MONTHLY_NOTE =
  "Monthly gifts give students support they can count on all year. Change or cancel anytime.";

const FREQUENCY_OPTIONS: { value: GivingFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "one-time", label: "One-time" },
];

const CONTROL_FOCUS =
  "focus-within:ring-2 focus-within:ring-[var(--color-1)] focus-within:ring-offset-2";

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Valid custom amounts are positive numbers; commas and a leading $ are tolerated. */
function parseCustomAmount(value: string): number | null {
  const amount = Number(value.replace(/[$,\s]/g, ""));
  return value.trim() && Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function GivingForm({
  title,
  description,
  donateUrl,
  monthlyDonateUrl,
  buildDonateHref = ({ url }) => url,
  defaultFrequency = "monthly",
  monthlyTiers,
  oneTimeTiers,
  defaultTierIndex = 1,
  footnote = DEFAULT_FOOTNOTE,
}: GivingFormProps) {
  const id = useId();
  const [frequency, setFrequency] = useState<GivingFrequency>(defaultFrequency);
  /** `null` means the "Other amount" field is selected. */
  const [tierIndex, setTierIndex] = useState<number | null>(defaultTierIndex);
  const [customAmount, setCustomAmount] = useState("");

  const isMonthly = frequency === "monthly";
  const tiers = isMonthly ? monthlyTiers : oneTimeTiers;
  const selectedTier = tierIndex === null ? undefined : tiers[tierIndex];
  const amount = selectedTier ? selectedTier.amount : parseCustomAmount(customAmount);

  const href = buildDonateHref({
    url: isMonthly ? (monthlyDonateUrl ?? donateUrl) : donateUrl,
    frequency,
    amount,
  });

  let ctaLabel = isMonthly ? "Give monthly" : "Give once";
  if (amount !== null) {
    ctaLabel = `Give ${formatAmount(amount)}${isMonthly ? " monthly" : ""}`;
  }

  const changeFrequency = (next: GivingFrequency) => {
    setFrequency(next);
    setTierIndex(defaultTierIndex);
    setCustomAmount("");
  };

  const selectTier = (index: number) => {
    setTierIndex(index);
    setCustomAmount("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
      <h3 className="heading-2 text-[var(--color-4)]">{title}</h3>
      <p className="body-md mt-3 text-slate-700">{description}</p>

      <fieldset className="mt-6">
        <legend className="sr-only">Gift frequency</legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = frequency === option.value;
            return (
              <label
                key={option.value}
                className={`touch-target flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center font-semibold transition-colors ${CONTROL_FOCUS} ${
                  isSelected ? "bg-[var(--color-1)] text-white" : "text-slate-700 hover:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-frequency`}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => changeFrequency(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {isMonthly ? <p className="body-sm mt-3 text-slate-600">{MONTHLY_NOTE}</p> : null}

      <fieldset className="mt-6">
        <legend className="sr-only">Gift amount</legend>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiers.map((tier, index) => {
            const isSelected = tierIndex === index;
            return (
              <label
                key={tier.amount}
                className={`touch-target flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-colors ${CONTROL_FOCUS} ${
                  isSelected
                    ? "border-[var(--color-2)] bg-[var(--color-6)]"
                    : "border-slate-200 bg-white hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-amount`}
                  value={tier.amount}
                  checked={isSelected}
                  onChange={() => selectTier(index)}
                  className="sr-only"
                />
                <span className="text-lg font-bold text-[var(--color-4)]">
                  {formatAmount(tier.amount)}
                </span>
                {isMonthly ? <span className="text-xs text-slate-700">/month</span> : null}
              </label>
            );
          })}
        </div>

        <label className="mt-3 block">
          <span className="body-sm font-semibold text-slate-700">Other amount</span>
          <span
            className={`touch-target mt-1 flex items-center rounded-xl border-2 px-3 transition-colors ${CONTROL_FOCUS} ${
              tierIndex === null
                ? "border-[var(--color-2)] bg-[var(--color-6)]"
                : "border-slate-200 bg-white"
            }`}
          >
            <span aria-hidden className="font-semibold text-slate-600">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={customAmount}
              onFocus={() => setTierIndex(null)}
              onChange={(event) => {
                setTierIndex(null);
                setCustomAmount(event.target.value);
              }}
              // Inline: the unlayered global `*:focus-visible` outline beats utilities; the wrapper shows focus.
              style={{ outline: "none" }}
              className="w-full min-w-0 bg-transparent py-2 pl-1 text-slate-900"
            />
          </span>
        </label>
      </fieldset>

      <p aria-live="polite" className="body-sm mt-4 min-h-[1.5em] text-slate-700">
        {selectedTier?.impact}
      </p>

      <Button href={href} variant="cta-primary" className="mt-4 w-full">
        {ctaLabel}
      </Button>

      <p className="mt-4 text-xs text-slate-600">{footnote}</p>
    </div>
  );
}
