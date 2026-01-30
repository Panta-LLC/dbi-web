import type { Meta, StoryObj } from "@storybook/react";

const Typography = () => {
  return (
    <div className="bg-white p-8 text-slate-800">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Display</p>
          <div className="mt-3 space-y-3">
            <p className="display-xl">Display XL</p>
            <p className="display-l">Display L</p>
            <p className="display-m">Display M</p>
            <p className="display-s">Display S</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Headings</p>
          <div className="mt-3 space-y-3">
            <p className="heading-1">Heading 1</p>
            <p className="heading-2">Heading 2</p>
            <p className="heading-3">Heading 3</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Body</p>
          <div className="mt-3 space-y-4">
            <p className="body-md">
              Body MD — Delta Bay Impact supports students and families through mentorship,
              advocacy, and community partnerships.
            </p>
            <p className="text-sm text-slate-600">
              Small text — Supporting details, captions, and secondary descriptions.
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Eyebrow text
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof Typography> = {
  title: "Style/Typography",
  component: Typography,
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {};
