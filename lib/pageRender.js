const puppeteer = require('puppeteer');

module.exports = async (uri, { navigationTimeout, resourceInterception }) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(navigationTimeout);

    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        let abortFlag = false;
        resourceInterception.forEach(function(regexp) {
            if (
                interceptedRequest.url().match(new RegExp(regexp[0]), regexp[1])
            )
                abortFlag = true;
        });
        abortFlag ? interceptedRequest.abort() : interceptedRequest.continue();
    });

    await page.goto(uri);
    const content = await page.content();
    await browser.close();
    return content;
};
