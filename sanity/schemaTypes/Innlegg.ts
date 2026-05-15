import { defineField, defineType } from "sanity";

export default defineType({
  name: "innlegg",
  title: "Innlegg",
  type: "document",
  fields: [
    defineField({
      name: "tittel",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "innhold",
      title: "Innhold",
      type: "array",
      of: [
        {
          type: "object",
          name: "tekstblokk",
          title: "Tekst",
          fields: [
            {
              name: "tekst",
              title: "Tekst",
              type: "text",
            },
          ],
          preview: {
            select: {
              title: "tekst",
            },
          },
        },

        {
          type: "object",
          name: "bildeblokk",
          title: "Bilde",
          fields: [
            {
              name: "bilde",
              title: "Bilde",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "alt",
              title: "Alt tekst",
              type: "string",
            },
          ],
        },

        {
          type: "object",
          name: "videoblokk",
          title: "Video",
          fields: [
            {
              name: "url",
              title: "Video URL",
              type: "url",
            },
          ],
        },
      ],
    }),
  ],
});