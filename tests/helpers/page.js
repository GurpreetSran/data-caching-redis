const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.setCookie({ name: 'session', value: session });
    await this.setCookie({ name: 'session.sig', value: sig });
    await this.goto('localhost:3000/blogs');
    await this.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.$eval(selector, (el) => el.innerHTML);
  }
}

module.exports = Page;
