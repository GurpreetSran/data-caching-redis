jest.setTimeout(30000);

const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  // await browser.close();
});

test('Header should have correct text', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts auth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test.only('when signed in, show logout button', async () => {
  const id = '5ede68fdb734e71ca1af9d5d';

  const Buffer = require('safe-buffer').Buffer;

  const sessionObject = {
    passport: {
      user: id,
    },
  };

  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
  );
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000');
});
