const cheerio = require("cheerio");
const e = require("express");

const { camelCase, has } = require("lodash");
const { getExamRawData, savePdf } = require("./rawResultScraper");

dataObject = {};

const getResultData = async (registerNumber) => {
  const keys = [
    "registrationNumber",
    "studentName",
    "degree",
    "course",
    "college",
    "examinationsOf",
  ];

  const rawData = await getExamRawData(registerNumber);
  let $ = await cheerio.load(rawData);

  $("table").children().last().remove();

  const metaData = [registerNumber];

  $("tr").each((index, element) => {
    $(element).each((childIdx, childElmnt) => {
      $(childElmnt)
        .children()
        .has("span")
        .each((i, data) => {
          $(data)
            .children()
            .each((i, j) => {
              metaData.push($(j).text());
            });
        });
    });
  });

  await keys.forEach((value, index) => {
    dataObject[value] = metaData[index];
  });

  dataObject["markSheet"] = await generateMarkSheet(rawData);
  return [dataObject];
};

const generateMarkSheet = async (rawData) => {
  const headerValues = [];
  let $ = await cheerio.load(rawData);
  await $(".HeaderStyle")
    .children()
    .each(async (i, el) => {
      await headerValues.push(camelCase($(el).text()));
    });
  await $(".HeaderStyle").children().remove();
  const rawResults = await $("table").children().last().html();
  const resultRowsValue = [];

  await $(rawResults)
    .children()
    .each(async (i, el) => {
      await resultRowsValue.push($(el).text());
    });

  const finalData = [];
  await resultRowsValue.forEach(async (value, index) => {
    await finalData.push([headerValues[index % headerValues.length], value]);
  });

  let singleSubjectResultObj = {};
  const resultsArray = [];
  await finalData.map((value, index) => {
    singleSubjectResultObj[value[0]] = value[1];
    if (index % headerValues.length === 4) {
      resultsArray.push(singleSubjectResultObj);
      singleSubjectResultObj = {};
    }
  });
  return resultsArray;
};

const getResultPdf = async (registerNo) => {
  const path = await savePdf(registerNo);
  if (path) {
    return path;
  } else {
    return;
  }
};

module.exports = { getResultData, getResultPdf };
