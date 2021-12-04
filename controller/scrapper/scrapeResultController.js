const fs = require("fs");
const path = require("path");

const {
  getResultData,
  getResultPdf,
} = require("../../util/scraper/resultData");

const getResultsJson = async (req, res) => {
  let data = await getResultData(req.params.registerNo);
  res.send(data);
};

const getResultsPdf = async (req, res) => {
  try {
    const fileName = await getResultPdf(req.params.registerNo);
    const downloadPath = path.join(__dirname, `../../pdfs`, fileName);
    res.download(downloadPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      try {
        fs.unlink(downloadPath, (err) => {
          if (err) console.log(err);
        });
      } catch (err) {
        console.error(err.message);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
};

module.exports = { getResultsJson, getResultsPdf };
