import {scrapeStories,scrapeStory} from "./scraper/scraper";
const puppeter = require("puppeteer");
import {setupCloudinary} from "../utils/utilities";
const PAGE_URL = "https://www.cnet.com/";

async function getLatestStories(){
    setupCloudinary();
    let browser = await puppeter.launch({headless : true});
    let stories =  await scrapeStories(browser, PAGE_URL,1);
    await browser.close();
    return stories;
}

export {getLatestStories};

