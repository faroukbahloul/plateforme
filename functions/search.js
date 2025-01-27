const puppeteer = require('puppeteer');

exports.handler = async (event) => {
    const query = event.queryStringParameters.query;

    if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Query parameter is required' }),
        };
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.tF2Cxc')).map((item) => ({
                title: item.querySelector('.DKV0Md')?.innerText,
                link: item.querySelector('.yuRUbf a')?.href,
            }));
        });

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
