const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  // await page.close();
});

describe('When logged in ', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows errors message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contectError = await page.getContentsOf('.content .red-text');
      expect(titleError).toEqual('You must provide a value');
      expect(titleError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  test('User can not create blog posts', async () => {
    const result = await page.evaluate(() => {
      return fetch('/api/blogs', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'My title', content: 'My content2' }),
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });
});
