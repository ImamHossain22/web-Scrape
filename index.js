// const axios = require("axios");
// const cheerio = require("cheerio");


// async function scrapeWebsite() {

//     const response = await axios.get("https://quotes.toscrape.com");
//     const $ = cheerio.load(response.data);
//     const quotes = [];

//     $('.quote').each((index, element) => {
        
//         quotes.push({
//             quote: $(element).find(".text").text(),
//             author: $(element).find(".author").text(),
//             tags: [$(element).find(".tag").text()]
//         });
        
//     });

//    console.log(quotes);
// }

// scrapeWebsite();


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeQuotes() {
    const allQuote = [];

    for (let page = 1; page <= 10; page++){
        const url = `https://quotes.toscrape.com/page/${page}/`;
        console.log(`Scraping Page ${page}...`);
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $(".quote").each((index, element) => {
            const quote = $(element).find(".text").text().trim();
            const author = $(element).find(".author").text().trim();

            const tags = [];

            $(element).find(".tag").each((index, tag) => {
                tags.push($(tag).text());
            });

            allQuote.push({quote,author,tags})
        })
    }

    fs.writeFileSync(
        "quotes.json",
        JSON.stringify(allQuote, null, 2)
    );
      console.log(`Done! Scraped ${allQuote.length} quotes.`);
    
};

scrapeQuotes();

