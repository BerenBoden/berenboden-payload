import { CollectionConfig } from "payload/types";

const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Only authenticated users
    update: ({ req: { user } }) => Boolean(user), // Only authenticated users
    delete: ({ req: { user } }) => Boolean(user), // Only authenticated users
  },
  admin: {
    useAsTitle: "name", // Field from the 'users' collection to display
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};

export default Categories;
