import { uploadFile } from '../../utils/utilities';

async function scrapeStories(browser, pageUrl, numStories = 5) {
  const page = await browser.newPage();
  await page.goto(pageUrl);

  await page.waitForSelector('.latestScrollItems');
  let latestStories = await page.$eval('div.latestScrollItems', (item, numStories) => {
    const storiesLinks = [];
    for (let i = 0; i < numStories; i++) {
      const rowItem = item.children[i];
      const storyURL = rowItem.querySelector('h3 > a').href;
      storiesLinks.push(storyURL);
    }
    return storiesLinks;
  }, numStories);

  latestStories = await Promise.all(
    latestStories.map(async (storyUrl) => scrapeStory(browser, storyUrl)),
  );
  return latestStories;
}

async function scrapeStory(browser, storyURL) {
  console.log('Scraping story : ', storyURL);
  const page = await browser.newPage();
  await page.goto(storyURL);
  await page.waitForSelector('.current');

  try {
    await page.click('.ot-sdk-container button#onetrust-accept-btn-handler');
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('Cannot close cookies popup');
  }
  return {
    title: await getTitle(page),
    summary: await getSummary(page),
    author: await getAuthor(page),
    date: await getPublishedDate(page),
    tags: await getPageTags(page),
    storyURL,
    imageURL: await getImageUrl(page),
    category: new URL(storyURL).pathname.split('/')[1],
    screenshotURL: await getScreenshortURL(page),
    pdfURL: await getPdfURL(page),
  };
}

async function getTitle(page) {
  try {
    return await page.$eval('.c-head > h1', (title) => title.innerHTML);
  } catch (err) {
    console.log('Could not find the title of the article:', err);
    return null;
  }
}

async function getSummary(page) {
  try {
    return await page.$eval('.c-head_dek', (summary) => summary.innerHTML);
  } catch (err) {
    console.log('Could not find the summary of the article:', err);
    return null;
  }
}

async function getAuthor(page) {
  try {
    return await page.$eval('.c-assetAuthor_authors .author', (author) => author.innerHTML);
  } catch (err) {
    console.log('Could not find the author of the article', err);
    return null;
  }
}

async function getPublishedDate(page) {
  try {
    return await page.$eval('.c-assetAuthor_date > time', (date) => date.innerHTML);
  } catch (err) {
    console.log('Could not find the publishing date : ', err);
    return null;
  }
}

async function getPageTags(page) {
  try {
    return await page.$eval('.row.tagList.desktop', (taglist) => {
      const tags = [];
      for (const index in taglist.children) {
        const tag = taglist.children[index];
        if (tag.href) {
          tags.push(tag.href);
        }
      }
      return tags;
    });
  } catch (err) {
    console.log('Could not find the article tag list', err);
    return null;
  }
}

async function getImageUrl(page) {
  try {
    return await page.$eval('figure.image.image-large img', (image) => image.src);
  } catch (err) {
    console.log('Could not find the main article image', err);
    return null;
  }
}

async function getPdfURL(page) {
  await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({ format: 'A4' });

  try {
    return await uploadFile(pdfBuffer);
  } catch (e) {
    console.log('Error uploading pdf to cloudinary', e.message);
    return null;
  }
}

async function getScreenshortURL(page) {
  const buffer = await page.screenshot({ encoding: 'binary', fullPage: true });

  try {
    return await uploadFile(buffer);
  } catch (e) {
    console.log('Error uploading image to cloudinary', e);
    return null;
  }
}

export { scrapeStories };
