import slugify from "slugify";
import { CollectionBeforeValidateHook } from "payload/types";

export const generateSlug: CollectionBeforeValidateHook = async ({
  data,
  operation,
}) => {
  if (operation === "create" || operation === "update") {
    data.slug = slugify(data.title, { lower: true });
  }
  return data;
};
