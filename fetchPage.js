const fs = require('fs');
const puppeteer = require('puppeteer');
const { ArgumentParser } = require('argparse');

async function fetchPage(url, waitTime, outputFile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the specified number of seconds
    await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

    const htmlContent = await page.content();
    fs.writeFileSync(outputFile, htmlContent);

    await browser.close();
}

const parser = new ArgumentParser({
    description: 'Fetch webpage HTML after waiting for a specified time'
});

parser.add_argument('-u', '--url', { help: 'URL of the webpage', required: true });
parser.add_argument('-w', '--wait', { help: 'Wait time in seconds', required: true });
parser.add_argument('-o', '--output', { help: 'Output file', required: true });

const args = parser.parse_args();

fetchPage(args.url, parseInt(args.wait), args.output).catch(console.error);
