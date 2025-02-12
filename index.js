import express from 'express';
import pptr from 'puppeteer';
import 'dotenv/config';

const app = express();
async function run() {
  const browser = await pptr.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : pptr.executablePath(),
    headless: 'new'
  });
  const [page] = await browser.pages();
  const url = 'https://www.instagram.com/accounts/edit/';
  await page.goto(url);
  await page.setCookie({
      name: 'sessionid',
      value: process.env.sessionid
  });
  await page.reload();
  const textarea = await page.waitForXPath('//*[@id="pepBio"]');
  await textarea.click({ clickCount: 3 });
  await textarea.type(new Date().toString() + 'mew');
  const button = await page.$('div.x1i10hfl:nth-child(1)[role="button"]');
  await button.click();
  console.log(`Bio updated to ${new Date().toString()}`);
  await browser.close();
  return 'Done!';
}

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  let totalMins = 0;
  setInterval(() => {
    totalMins += 1;
    res.send('total mins: ' + totalMins);
  }, 60000);
});

app.get('/run', (req, res) => {
  setInterval(async () => {
    await run();
    console.log('done');
  }, 60000);
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});