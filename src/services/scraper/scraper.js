import {uploadFile} from "../../utils/utilities";

async function scrapeStories(browser, page_url, num_stories = 5) {

    let page = await browser.newPage();
    await page.goto(page_url);

    await page.waitForSelector('.latestScrollItems');
    let latestStories = await page.$eval('div.latestScrollItems', (item, num_stories) => {
        let stories_links = [];
        for (let i = 0; i < num_stories; i++) {
            const row_item = item.children[i];
            let storyURL = row_item.querySelector('h3 > a').href;
            stories_links.push(storyURL);
        }
        return stories_links;
    }, num_stories);

    latestStories = await Promise.all(
        latestStories.map(async (storyUrl) => {
                return await scrapeStory(browser, storyUrl);
            }
        ));
    return latestStories;
}

async function scrapeStory(browser, storyURL) {
    console.log("Scraping story : ", storyURL);
    let page = await browser.newPage();
    await page.goto(storyURL);
    await page.waitForSelector('.current');

    try {
        await page.click('.ot-sdk-container button#onetrust-accept-btn-handler');
        await page.waitForTimeout(500);

    } catch (e) {
        console.log("Cannot close cookies popup")
    }
    return {
        title : await getTitle(page),
        summary : await getSummary(page),
        author : await getAuthor(page),
        date : await getPublishedDate(page),
        tags : await getPageTags(page),
        storyURL : storyURL,
        imageURL : await getImageUrl(page),
        category : new URL(storyURL).pathname.split('/')[1],
        screenshotURL : await getScreenshortURL(page),
        pdfURL : await getPdfURL(page)
    }
}

async function getTitle(page){
    try {
        return await page.$eval('.c-head > h1', title => title.innerHTML);
    } catch (err) {
        console.log('Could not find the title of the article:', err);
        return null;
    }
}

async function getSummary(page){
    try {
        return await page.$eval('.c-head_dek', summary => summary.innerHTML);
    } catch (err) {
        console.log('Could not find the summary of the article:', err);
        return  null;
    }
}

async function getAuthor(page){
    try {
        return await page.$eval('.c-assetAuthor_authors .author', author => author.innerHTML);
    } catch (err) {
        console.log('Could not find the author of the aricle', err);
        return null;
    }
}

async function getPublishedDate(page){
    try {
        return await page.$eval('.c-assetAuthor_date > time', date => date.innerHTML);
    } catch (err) {
        console.log('Could not find the publishing date : ', err);
        return null;
    }
}

async function getPageTags(page) {
    try {
        return await page.$eval('.row.tagList.desktop', (taglist) => {
            let tags = [];
            for (let index in taglist.children) {
                let tag = taglist.children[index];
                if (tag.href) {
                    tags.push(tag.href);
                }
            }
            return tags;
        })
    } catch (err) {
        console.log('Could not find the article tag list', err);
        return null;
    }
}

async function getImageUrl(page) {
    try {
        return await page.$eval('figure.image.image-large img', (image) => {
            return image.src;
        });
    } catch (err) {
        console.log('Could not find the main article image', err);
        return null;

    }
}

async function getPdfURL(page){
    await page.emulateMediaType('screen');
    var pdfBuffer = await page.pdf({format: 'A4'});

    try {
        return await uploadFile(pdfBuffer);
    } catch (e) {
        console.log("Error uploading pdf to cloudinary", e.message);
        return null;
    }
}

async function getScreenshortURL(page){
    var buffer = await page.screenshot({encoding: 'binary', fullPage: true});


    try {
        return await uploadFile(buffer);
    } catch (e) {
        console.log("Error uploading image to cloudinary", e);
        return null;
    }
}

export {scrapeStories};