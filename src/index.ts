import puppeteer from 'puppeteer';

(async () => {
	// Useful options
	// headless: boolean => whether to actually open the browser for you to see
	// slowMo: integer => wait x amount of ms between each action
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Navigate where you want to go
	const url = 'https://javascriptwebscrapingguy.com';
	await page.goto(url);

	// Get innerHTML
	const title = await page.$eval('title', element => element.innerHTML);
	console.log('title', title);

	// click something for navigation or interaction
	// await page.click('.entry-title');

	// Click something and wait for it to complete whatever it's doing
	// await Promise.all([page.click('.entry-title'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);

	// When going through a list of pages, it's best to collect the hrefs in an array and then open them individually so you don't lose browser context

	const links = await page.$$('.entry-title');

	// Bad way
	// Will throw "Error: Execution context was destroyed, most likely because of a navigation" because link ElementHandle is no longer visible
	// for (let link of links) {
	// 	await link.click();
	// }

	// Good way to do it
	const urls: any[] = [];
	for (let link of links) {
		const url = await link.$eval('a', element => element.getAttribute('href'));
		urls.push(url);
	}

	for (let url of urls) {
		await page.goto(url);
	}

	await browser.close();

})();