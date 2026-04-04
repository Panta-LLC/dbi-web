import { defineArrayMember, defineField } from "sanity";

/** Shared block config for section body copy (collection articles, hero split, etc.). */
export const simplePortableTextBlockMember = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
            validation: (Rule) =>
              Rule.uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto", "tel"],
              }),
          }),
        ],
      },
    ],
  },
});

export function simplePortableTextField(opts: {
  name: string;
  title: string;
  description?: string;
}) {
  return defineField({
    name: opts.name,
    title: opts.title,
    type: "array",
    of: [simplePortableTextBlockMember],
    description: opts.description,
  });
}
