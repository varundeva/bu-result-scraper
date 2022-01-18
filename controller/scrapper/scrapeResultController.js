const fs = require("fs");
const path = require("path");

const {
  getResultData,
  getResultPdf,
} = require("../../util/scraper/resultData");
const { User } = require("../../models/index");

const getResultsJson = async (req, res) => {
  let { registerNo } = req.params;

  let record = await User.findOne({ registrationNumber: registerNo });
  if (record !== null) {
    return res.send(record);
  }
  res.status(200).json({
    status: 200,
    message: "No Records Found. Please Cache your result",
  });
};

const cacheNewResult = async (req, res) => {
  let data = await getResultData(req.params.registerNo);
  const { registrationNumber, studentName } = data[0];
  let record = await User.findOne({ registrationNumber });
  if (record === null) {
    var dataInserted = await User.create({
      registrationNumber,
      studentName,
      results: data,
    });
    return res.send(dataInserted);
  } else {
    // record.results.map(async (result) => {
    //   console.log(result.examinationsOf);
    //   if (result.examinationsOf !== data.examinationsOf) {
    //     record.results.push(data[0]);
    //     await record.save();
    //     let updatedData = User.findOne({ registrationNumber });
    //     console.log(updatedData);
    //     return res.send("updatedData");
    //   } else {
    //     return res.send({
    //       status: 200,
    //       message: "Result already cached. please verify",
    //     });
    //   }
    // });
    // let result = await User.findOneAndUpdate(
    //   registrationNumber,
    //   { $push: { results: data[0] } },
    //   { upsert: true, new: true }
    // );
    // return res.send(result);
  }
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

module.exports = { getResultsJson, getResultsPdf, cacheNewResult };
