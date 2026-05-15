import { defineField, defineType } from "sanity";

export default defineType({
  name: "quizQuestion",
  title: "Quiz spørsmål",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Spørsmål",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "answers",
      title: "Svar alternativer",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Svartekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "correct",
              title: "Riktig svar",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "text",
              correct: "correct",
            },
            prepare({ title, correct }) {
              return {
                title,
                subtitle: correct ? "Riktig" : "Feil",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2),
    }),

    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      description: "Brukes for å sortere spørsmål i quizen",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "question",
      subtitle: "order",
      media: "image",
    },
  },
});