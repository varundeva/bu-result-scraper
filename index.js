const express = require("express");
require("dotenv").config();

const { getResultData, getResultPdf } = require("./scraper/resultData");

const app = express();

app.get("/", async (req, res) => {
  res.send("Server is Running...");
});

app.get("/api/result-pdf/:registerNo", async (req, res) => {
  const downloadPath = await getResultPdf(req.params.registerNo);
  res.download(downloadPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    const fs = require("fs");
    try {
      fs.unlinkSync(downloadPath);
    } catch (err) {
      console.error(err.message);
    }
  });
});

app.get("/api/result/:registerNo", async (req, res) => {
  let data = await getResultData(req.params.registerNo);
  res.send(data);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at ${process.env.PORT}`);
});

// (async () => {
//   let data = await getResultData("19SKC41018");
//   console.log(data);
// })();
