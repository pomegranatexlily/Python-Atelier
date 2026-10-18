import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
const page=await context.newPage();
const libraryKey='pl.atelier.learning.v1';

try {
  await page.goto('http://127.0.0.1:8765/app/#resources',{waitUntil:'domcontentloaded'});
  const reject=page.getByRole('button',{name:'Reject optional'});
  if (await reject.isVisible()) await reject.click();

  await page.locator('#resourcesView:not([hidden])').waitFor();
  assert.equal(await page.locator('#resourcesView .resource-card').count(),3);
  assert.match(await page.locator('#resourcesRoot').innerText(),/freeCodeCamp/);

  const before=await page.evaluate(key=>localStorage.getItem(key),libraryKey);
  await page.locator('[data-resource-filter="All"]').click();
  assert.equal(await page.locator('.resource-card').count(),10);
  assert.equal(await page.locator('.resource-link').count(),10);
  const links=await page.locator('.resource-link').evaluateAll(nodes=>
    nodes.map(a=>({url:a.href,target:a.target,rel:a.rel,policy:a.referrerPolicy})));
  assert.ok(links.every(x=>x.url.startsWith('https://github.com/')||
    x.url.startsWith('https://roadmap.sh/')));
  assert.ok(links.every(x=>x.target==='_blank'&&x.rel.includes('noopener')&&
    x.rel.includes('noreferrer')&&x.policy==='no-referrer'));

  await page.locator('[data-resource-filter="Build projects"]').click();
  assert.equal(await page.locator('.resource-card').count(),3);
  assert.match(await page.locator('.resource-card').first().innerText(),/Project-Based Learning/);

  await page.locator('[data-resource-filter="Later"]').click();
  assert.equal(await page.locator('.resource-card').count(),4);
  assert.match(await page.locator('.resource-card').first().innerText(),/Build Your Own X/);

  await page.locator('#resourcesPractice').click();
  await page.locator('#practiceView:not([hidden])').waitFor();
  await page.locator('[data-open-challenge="name-greeting"]').click();
  const related=page.locator('.practice-resources');
  assert.match(await related.innerText(),/Study beside this challenge/);
  assert.equal(await related.locator('.resource-link').count(),2);
  await page.locator('[data-product-view="resources"]').click();
  await page.locator('#resourcesView:not([hidden])').waitFor();
  await page.locator('#resourcesWorkbench').click();
  await page.locator('#ws').waitFor();
  assert.equal(await page.locator('#resourcesView').isHidden(),true);
  assert.equal(await page.locator('#src').count(),1,'Original Python editor intact');
  assert.equal(await page.locator('#out').count(),1,'Original Python console intact');

  const after=await page.evaluate(key=>localStorage.getItem(key),libraryKey);
  assert.equal(after,before,'Browsing external resource cards must not modify practice progress');
  console.log('PASS iPhone Resources UI: 10 links, 3 category filters, practice recommendations, return to code, learning data unchanged.');
} finally {
  await browser.close();
}
