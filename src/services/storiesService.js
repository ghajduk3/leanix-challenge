import { scrapeStories } from './scraper/scraper';

const puppeter = require('puppeteer');

const PAGE_URL = 'https://www.cnet.com/';

async function getLatestStories() {
  const browser = await puppeter.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const stories = await scrapeStories(browser, PAGE_URL, 5);
  await browser.close();
  return stories;
}

export { getLatestStories };
