const puppeteer = require("puppeteer");
const path = require("path");

const savePdf = async (registerNumber) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
  });
  const page = await browser.newPage();
  await page.goto(process.env.RESULT_URL);
  try {
    await page.waitForSelector("#ContentPlaceHolder1_txtSearch");
    await page.type("#ContentPlaceHolder1_txtSearch", registerNumber);
    await page.click("#ContentPlaceHolder1_btnSearch");

    await page.waitForSelector(".table");
    const fileName = `${registerNumber}.pdf`;
    const savePath = path.join(__dirname, `../../pdfs`, fileName);
    await page.pdf({
      path: savePath, // Saves pdf to disk.
      format: "A4",
      printBackground: true,
    });
    return fileName;
  } catch (e) {
    console.error(e.message);
  }
  await browser.close();
};

module.exports = { savePdf };
