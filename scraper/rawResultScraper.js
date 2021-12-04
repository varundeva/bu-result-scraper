const puppeteer = require("puppeteer");
const path = require("path");
// const B2 = require("backblaze-b2");

const getExamRawData = async (registerNumber) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(process.env.RESULT_URL);
  try {
    await page.waitForSelector("#ContentPlaceHolder1_txtSearch");
    await page.type("#ContentPlaceHolder1_txtSearch", registerNumber);
    await page.click("#ContentPlaceHolder1_btnSearch");

    await page.waitForSelector(".table");

    // await page.pdf({
    //   path: `${registerNumber}.pdf`, // Saves pdf to disk.
    //   format: "A4",
    //   printBackground: true,
    // });

    const htmlData = await page.$eval(".table", (e) => e.outerHTML);

    return htmlData;
  } catch (e) {
    console.log(e.message);
  }
  await browser.close();
};

const savePdf = async (registerNumber) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(process.env.RESULT_URL);
  try {
    await page.waitForSelector("#ContentPlaceHolder1_txtSearch");
    await page.type("#ContentPlaceHolder1_txtSearch", registerNumber);
    await page.click("#ContentPlaceHolder1_btnSearch");

    await page.waitForSelector(".table");
    const fileName = `${registerNumber}.pdf`;
    const savePath = path.join(__dirname, `../pdfs`, fileName);
    console.log(`Saving Path ${savePath}`);
    await page.pdf({
      path: savePath, // Saves pdf to disk.
      format: "A4",
      printBackground: true,
    });
    console.info("Pdf Saved");
    return fileName;
  } catch (e) {
    console.error(e.message);
  }
  await browser.close();
};

// const uploadToBucket = async () => {
//   const b2 = new B2({
//     applicationKeyId: process.env.applicationKeyId,
//     applicationKey: process.env.applicationKey,
//   });

//   try {
//     await b2.authorize();
//     let response = await b2.getUploadUrl({
//       bucketId: process.env.bucketId,
//     });
//     const uploadResponse = await b2.uploadFile({
//       uploadUrl: response.data.authorizationToken,
//       uploadAuthToken: response.data.uploadUrl,
//       fileName: `${registerNumber}.pdf`,
//       data: `../${registerNumber}.pdf`, // this is expecting a Buffer, not an encoded string
//     });
//   } catch (error) {
//     console.error(error.message);
//   }
// };

module.exports = { getExamRawData, savePdf };
