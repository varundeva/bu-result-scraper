const puppeteer = require("puppeteer");

const getExamRawData = async (registerNumber) => {
  const browser = await puppeteer.launch({ headless: true });
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

module.exports = { getExamRawData };
