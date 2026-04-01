import { defineField, defineType } from "sanity";

/** Same fields as `contactForm` but all optional — for card grid CTAs that may be partially configured. */
export const contactFormOptional = defineType({
  name: "contactFormOptional",
  title: "Contact Form",
  type: "object",
  fields: [
    defineField({ name: "firstNamePlaceholder", title: "First Name Placeholder", type: "string" }),
    defineField({ name: "lastNamePlaceholder", title: "Last Name Placeholder", type: "string" }),
    defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
    defineField({ name: "organizationPlaceholder", title: "Organization Placeholder", type: "string" }),
    defineField({ name: "messagePlaceholder", title: "Message Placeholder", type: "string" }),
    defineField({ name: "submitLabel", title: "Submit Button Label", type: "string" }),
  ],
});
