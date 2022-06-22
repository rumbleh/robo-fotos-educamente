const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { PendingXHR } = require('pending-xhr-puppeteer');

puppeteer.use(StealthPlugin())

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage()
    const pendingXHR = new PendingXHR(page);

    var base = 'https://www.educamente.com.br/pesquisa?t=#/pagina-'
    var links_pagina = []
    var links = []

    for (var i = 1; i <= 25; i++) {

        links_pagina = []

        await page.goto(`${base}${i}`, { waitUntil: ['networkidle2', 'domcontentloaded'] })
        await delay(3000)
        await pendingXHR.waitForAllXhrFinished();
        await page.waitForSelector('.item-description > h3 > a[href]')

        links_pagina = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('.item-description > h3 > a[href]'),
                a => a.getAttribute('href')
            )
        )

        for (var k = 0; k < links_pagina.length; k++) {
            links.push('https://www.educamente.com.br' + links_pagina[k]);
        }

    }

    await browser.close();
    links.map((link) => console.log(link))


})