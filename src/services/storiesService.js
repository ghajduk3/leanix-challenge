import {scrapeStories,scrapeStory} from "./scraper/scraper";
const puppeter = require("puppeteer");
import {setupCloudinary} from "../utils/utilities";
const PAGE_URL = "https://www.cnet.com/";

async function getLatestStories(){
    let browser = await puppeter.launch({headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']});
    let stories =  await scrapeStories(browser, PAGE_URL,5);
    await browser.close();
    return stories;
}

export {getLatestStories};

