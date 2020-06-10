const puppeteer = require('puppeteer');

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }
}

module.exports = Page;
