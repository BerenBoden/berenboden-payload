import { CollectionConfig } from "payload/types";
import { generateSlug } from "./hooks/generate-slug";
import { slateEditor } from "@payloadcms/richtext-slate";

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
      path: "/type/:resource",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const { resource } = req.params;
          const page =
            typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
          const limit =
            typeof req.query.limit === "string"
              ? parseInt(req.query.limit)
              : 10;
          const resources = await req.payload.find({
            collection: "resources",
            where: {
              resource: {
                equals: resource,
              },
            },
            limit: limit,
            page: page,
          });
          res.status(200).json(resources);
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
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
      name: "shortDescription",
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
      type: "richText",
      // Pass the Slate editor here and configure it accordingly
      editor: slateEditor({
        admin: {
          elements: [
            // customize elements allowed in Slate editor here
          ],
          leaves: [
            // customize leaves allowed in Slate editor here
          ],
        },
      }),
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
      name: "links", // required
      type: "array", // required
      label: "External Links",
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: "Link",
        plural: "Links",
      },
      fields: [
        {
          name: "label",
          type: "text",
        },
        {
          name: "link",
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
