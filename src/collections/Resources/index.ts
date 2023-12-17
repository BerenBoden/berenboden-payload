import { CollectionConfig } from "payload/types";
import { slugField } from "../../fields/slug";

const Resources: CollectionConfig = {
  slug: "resources",
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Only authenticated users
    update: ({ req: { user } }) => Boolean(user), // Only authenticated users
    delete: ({ req: { user } }) => Boolean(user), // Only authenticated users
  },

  fields: [
    // slugField(),
    {
      name: "title",
      type: "text",
    },
    {
      name: "cover",
      type: "text",
    },
    {
      name: "coverAltText",
      type: "text",
    },
    {
      name: "featured",
      type: "checkbox",
    },
    {
      name: "content",
      type: "text",
    },
    {
      name: "resource", // required
      type: "radio", // required
      options: [
        // required
        {
          label: "article",
          value: "article",
        },
        {
          label: "certification",
          value: "certification",
        },
        {
          label: "project",
          value: "project",
        },
        {
          label: "technology",
          value: "technology",
        },
      ],
      admin: {
        layout: "horizontal",
      },
    },
    {
      name: "externalLinks",
      type: "array",
      fields: [
        {
          name: "externalLink",
          type: "text",
        },
      ],
    },
  ],
};

export default Resources;
