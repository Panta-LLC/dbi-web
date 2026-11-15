import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { CampaignPaceMeter } from "@/components/CampaignPaceMeter";

// Example year-end campaign: Giving Tuesday (Dec 1) through Dec 31, Pacific time.
const YEAR_END = {
  title: "Year-End Campaign",
  eyebrow: "Giving Tuesday → Dec 31",
  goal: 50_000,
  start: "2026-12-01T00:00:00-08:00",
  end: "2027-01-01T00:00:00-08:00",
  milestones: [{ date: "2026-12-25T00:00:00-08:00", label: "Dec 25" }],
  ctaHref: "/donate",
  ctaLabel: "Give now",
};

const meta: Meta<typeof CampaignPaceMeter> = {
  title: "Components/CampaignPaceMeter",
  component: CampaignPaceMeter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Combines the campaign countdown with the raise goal. Each slanted block is one day (or week) of the campaign and also an equal share of the goal; orange fill is money raised. If the fill reaches past the **Today** marker, giving is ahead of pace; hatched past blocks are the gap to close.",
      },
    },
  },
  args: { ...YEAR_END, live: true },
  argTypes: {
    goal: { control: { type: "number", step: 500 } },
    raised: { control: { type: "range", min: 0, max: 60_000, step: 250 } },
    variant: { control: "inline-radio", options: ["full", "compact"] },
  },
  decorators: [(Story) => <div className="mx-auto max-w-4xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof CampaignPaceMeter>;

export const AheadOfPace: Story = {
  args: { raised: 24_500, now: "2026-12-12T12:00:00-08:00" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Ahead of pace")).toBeInTheDocument();
    await expect(canvas.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "24500");
  },
};

export const OnPace: Story = {
  args: { raised: 30_000, now: "2026-12-19T14:00:00-08:00" },
};

export const BehindPace: Story = {
  args: { raised: 21_000, now: "2026-12-20T09:00:00-08:00" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Behind pace")).toBeInTheDocument();
  },
};

export const FinalHours: Story = {
  args: { raised: 46_200, now: "2026-12-31T15:00:00-08:00" },
};

export const GoalReached: Story = {
  args: { raised: 52_300, now: "2026-12-27T10:00:00-08:00" },
};

export const StartingSoon: Story = {
  args: { raised: 4_000, now: "2026-11-24T10:00:00-08:00", eyebrow: "Early gifts welcome" },
};

export const ClosedShort: Story = {
  args: { raised: 43_800, now: "2027-01-02T10:00:00-08:00" },
};

/** Campaigns over 45 days switch to one block per week. */
export const LongCampaignByWeek: Story = {
  args: {
    title: "Q4 Campaign",
    eyebrow: "October → December",
    goal: 120_000,
    raised: 51_000,
    start: "2026-10-01T00:00:00-07:00",
    end: "2027-01-01T00:00:00-08:00",
    now: "2026-11-10T12:00:00-08:00",
    milestones: [{ date: "2026-12-01T00:00:00-08:00", label: "Giving Tuesday" }],
  },
};

export const Compact: Story = {
  args: { raised: 24_500, now: "2026-12-12T12:00:00-08:00", variant: "compact" },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
};

/** Uses the real clock: a 30-day campaign that started 10 days ago. */
export const RealClock: Story = {
  args: (() => {
    const now = Date.now();
    return {
      raised: 19_000,
      start: new Date(now - 10 * 86_400_000).toISOString(),
      end: new Date(now + 20 * 86_400_000).toISOString(),
      now: undefined,
      milestones: [],
      eyebrow: "Live clock",
    };
  })(),
};
