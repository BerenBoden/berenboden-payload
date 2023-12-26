import { CollectionConfig } from "payload/types";
import { generateSlug } from "./hooks/generate-slug";

const Resources: CollectionConfig = {
  slug: "resources",
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Only authenticated users
    update: ({ req: { user } }) => Boolean(user), // Only authenticated users
    delete: ({ req: { user } }) => Boolean(user), // Only authenticated users
  },
  hooks: {
    // ...other hooks
    beforeValidate: [generateSlug],
  },

  endpoints: [
    {
      path: "/slug/:slug",
      method: "get",
      handler: async (req, res, next) => {
        const { slug } = req.params;
        const result = await req.payload.find({
          collection: "resources",
          where: {
            slug: {
              equals: slug,
            },
          },
        });

        if (result && result.docs && result.docs.length > 0) {
          res.status(200).json(result.docs[0]);
        } else {
          res.status(404).send({ error: "Item not found" });
        }
      },
    },
    {
      path: "/featured/:resource",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const { resource } = req.params;
          const featuredItems = await req.payload.find({
            collection: "resources",
            where: {
              featured: {
                equals: true,
              },
              resource: {
                equals: resource,
              },
            },
          });
          res.status(200).json(featuredItems.docs);
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
      },
    },
  ],
  fields: [
    {
      name: "categories",
      type: "relationship",
      relationTo: ["categories"],
      hasMany: true,
    },
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
    {
      name: "slug",
      type: "text",
      admin: {
        readOnly: true, // makes the field read-only in the admin UI
      },
    },
  ],
};

export default Resources;
