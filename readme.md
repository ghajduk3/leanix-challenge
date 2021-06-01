# LEANIX SOFTWARE ENGINEER CHALLENGE
##### author: Gojko Hajdukovic, 06.2021

Table of contents:
1. [Project requirements](#introduction)
2. [Setup](#setup)
3. [Description](#description)

<a name="introduction"></a>
### Project requirements
Prepare REST API in Node.js which will on request to GET /stories scrape and return JSON array with summary of the 5 latest stories from the webpage https://www.cnet.com/.

Each summary of the story should include:

* News header

* A short summary of the article

* Category in which the story was published

* Tags with which the story is tagged

* Author of the story

* URL to the story

* When the story was published

* URL to the main image in the article

* URL to full page screenshot image of story (optional)

* URL to PDF file of print of story (optional)

For scraping use Puppeteer library (https://github.com/GoogleChrome/puppeteer).
Publish your code on GitHub and send a link to the repository.
Please feel free to reach out to Matjaz Grosek at Matjaz.Grosek@leanix.net for any questions related to the task.
Wish you all the best in your preparation.

<a name="setup"></a>
### Setup
These instructions assume that the user has cloned the repository and is in repo's root:
```bash script
git clone https://github.com/ghajduk3/leanix-challenge.git && cd leanix-challenge
```
In order to install the required dependencies issue : 
```bash script
npm install 
```
Application uses [Cloudinary](https://cloudinary.com/) to save and serve scraped images and pdfs. In order to setup cloudinary create an account on [Cloudinary](https://cloudinary.com/).
After obtaining account information issue the following:
```bash script
cp .env.example .env
```
Fill in the required information in `.env` file:
```bash script
CLOUD_NAME=
API_KEY=
API_SECRET=
```
In order to start the server issue:
```bash script
npm start
```
Started server exposes the REST api endpoints on [localhost:8085/](http://localhost:8085).

<a name="description"></a>
### Description
In the following subsections I present a brief explanation of what the system is composed of, and the details for kicking off with it.

#### TECH STACK USED
* Node JS
* Cloudinary for data storage

#### REST API
To achieve the required functionalities efficiently, we need the following endpoints: All the enpoints are exposed on the `/` base mapping.

**GET methods**
* `GET \hello` 
    * welcome endpoint
    * produces a `SuccessResponse`
    
* `GET \stories`
    * produces a list of `JSONs` with summaries for five latest stories published at https://www.cnet.com/.

**STORY SUMMARY**

Each story summary exposes JSON with following fields:
** SAMPLE DATA ** 
```angular2html
{
    "title": "How fast is my internet? One easy way to tell if your connection's as slow as it feels",
    "summary": "See if your internet provider is providing the speed you're paying for -- and if not, here’s what you can do about it.",
    "author": "Jason Cipriani",
    "date": "June 1, 2021 5:15 a.m. PT",
    "tags": [
        "https://www.cnet.com/tech-tips/",
        "https://www.cnet.com/home/internet/broadband/",
        "https://www.cnet.com/online/services/",
        "https://www.cnet.com/tags/comcast/"
    ],
    "storyURL": "https://www.cnet.com/home/internet/how-fast-is-my-internet-one-easy-way-to-tell-if-your-connections-as-slow-as-it-feels/",
    "imageURL": "https://www.cnet.com/a/img/mGmnNTitScps8RFrzaLqmdL6pZU=/2021/05/13/12fccba5-6244-4368-9c24-a16d84c29dbb/hp-elite-folio-13-5-inch-2-in-1-notebook-pc-cnet-2021-014.jpg",
    "category": "home",
    "screenshotURL": "http://res.cloudinary.com/ghajduk/image/upload/v1622549788/cjzybfhkbkh2u7xch0vo.png",
    "pdfURL": "http://res.cloudinary.com/ghajduk/image/upload/v1622560766/ulvpcb4x5zz6zdlgctg5.pdf"
}
```
If the scraper cannot find specific field information it inserts `null` as a field value.







