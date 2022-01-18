const express = require("express");

require("dotenv").config();

const { resultRoutes } = require("./routes");
const { User } = require("./models");

const app = express();

app.use(express.json());

app.use("/api", resultRoutes);

app.get("/", async (req, res) => {
  res.send("Server is Running...");
});

app.get("/b2", async (req, res) => {
  const { uploadBucket } = require("./util/scraper/uploadToBucket");
  await uploadBucket(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at ${process.env.PORT}`);
});
