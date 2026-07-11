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


const { google } = require("googleapis");
const axios = require("axios");
const cheerio = require("cheerio");

// Authenticate with Google
const auth = new google.auth.GoogleAuth({
  keyFile: "Credentials.json", // Your downloaded service account JSON file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

async function scrapeQuotes() {
  try {
    const rows = [];

    // Optional: Add column headers
    rows.push(["Quote", "Author", "Tags"]);

    for (let page = 1; page <= 10; page++) {
      const url = `https://quotes.toscrape.com/page/${page}/`;

      console.log(`Scraping Page ${page}...`);

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      $(".quote").each((index, element) => {
        const quote = $(element).find(".text").text().trim();
        const author = $(element).find(".author").text().trim();

        const tags = [];

        $(element)
          .find(".tag")
          .each((i, tag) => {
            tags.push($(tag).text());
          });

        rows.push([
          quote,
          author,
          tags.join(", "),
        ]);
      });
    }

    console.log(`Uploading ${rows.length - 1} quotes to Google Sheets...`);

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1i_RyQQm8t0dEM1RvmhUS-muwx-X74jECAWGfyO97fes",
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    console.log("✅ Data uploaded successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.response) {
      console.error(error.response.data);
    }
  }
}

scrapeQuotes();

