const express = require("express");
require("dotenv").config();

const { resultRoutes } = require("./routes");

const app = express();

app.get("/", async (req, res) => {
  res.send("Server is Running...");
});

app.use("/api", resultRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at ${process.env.PORT}`);
});
