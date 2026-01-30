import type { Meta, StoryObj } from "@storybook/react";

const ColorPalette = () => {
  const colors = [
    { name: "Color 1", var: "--color-1" },
    { name: "Color 2", var: "--color-2" },
    { name: "Color 3", var: "--color-3" },
    { name: "Color 4", var: "--color-4" },
    { name: "Color 5", var: "--color-5" },
  ];

  return (
    <div className="bg-white p-8">
      <h2 className="heading-2">Color Palette</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {colors.map((color) => (
          <div key={color.var} className="rounded-md border border-border bg-white p-4">
            <div
              className="h-24 w-full rounded-md border border-border"
              style={{ background: `var(${color.var})` }}
            />
            <p className="mt-3 text-sm font-semibold text-slate-700">{color.name}</p>
            <p className="text-xs text-slate-500">{color.var}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const meta: Meta<typeof ColorPalette> = {
  title: "Style/Color Palette",
  component: ColorPalette,
};

export default meta;

type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {};
