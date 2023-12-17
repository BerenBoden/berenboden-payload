import slugify from "slugify";
import { GlobalBeforeChangeHook } from "payload/types";

const generateSlug: GlobalBeforeChangeHook = ({ data, req, originalDoc }) => {

  if (data.title && !data.slug) {
    // Generate a slug from the title
    const slug = slugify(data.title, {
      lower: true, // convert to lower case
      strict: true, // strip special characters
      trim: true, // trim leading and trailing spaces
    });

    // Assign the slug to the data object
    data.slug = slug;
  }

  return data;
};

export default generateSlug;
