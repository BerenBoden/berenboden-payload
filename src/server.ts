import express from "express";
import payload from "payload";

require("dotenv").config();
const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.get("/api/resources/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      // Assuming 'resources' is your collection name
      const data = await payload.find({
        collection: "resources",
        where: {
          title: {
            equals: slug,
          },
        },
        depth: 1, // adjust according to your needs
      });

      if (data.docs.length === 0) {
        return res.status(404).send("Resource not found");
      }

      res.json(data.docs[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.listen(3001);
};

start();
