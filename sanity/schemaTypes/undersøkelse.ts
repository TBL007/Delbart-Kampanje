import { defineField, defineType } from "sanity";

export default defineType({
  name: "surveyQuestion",
  title: "Undersøkelse spørsmål",
  type: "document",

  fields: [
    defineField({
      name: "question",
      title: "Spørsmål",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "type",
      title: "Svartype",
      type: "string",
      options: {
        list: [
          { title: "Flervalg (én)", value: "single" },
          { title: "Flervalg (flere)", value: "multiple" },
        
          { title: "Skala (1-5)", value: "scale" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "options",
      title: "Svaralternativer",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Tekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      hidden: ({ parent }) =>
       parent?.type === "scale",
    }),

    defineField({
      name: "required",
      title: "Obligatorisk spørsmål?",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "question",
      subtitle: "type",
    },
  },
});