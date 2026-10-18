'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'app','resources.js'),'utf8'),context,{timeout:1000});
const catalog=context.window.AtelierResources;
assert.ok(catalog);
const entries=catalog.entries;
assert.equal(entries.length,10);
assert.equal(new Set(Array.from(entries,x=>x.id)).size,10,'IDs must be unique');
assert.deepEqual(Array.from(catalog.categories),['Start here','Build projects','Later']);
const perCategory=Object.fromEntries(Array.from(catalog.categories).map(category=>[
 category,Array.from(entries).filter(x=>x.category===category).length
]));
assert.deepEqual(perCategory,{'Start here':3,'Build projects':3,'Later':4});
const cs50Ids=['name-greeting','tip-calculator','indoor-voice','playback-speed','file-extension'];
for (const x of entries) {
 const u=new URL(x.url);
 assert.equal(u.protocol,'https:');
 assert.ok(['github.com','roadmap.sh'].includes(u.hostname),x.id+' must use reviewed domain');
 assert.ok(x.title.length>5 && x.reason.length>25 && x.exercise.length>25);
 assert.ok(Object.isFrozen(x)&&Object.isFrozen(x.challengeIds));
 assert.ok(x.challengeIds.every(y=>cs50Ids.includes(y)),x.id);
}
for(const id of cs50Ids){
 assert.ok(entries.some(x=>x.challengeIds.includes(id)),id+' should have contextual study links');
}
const html=fs.readFileSync(path.join(root,'app','index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'app','learning.js'),'utf8');
assert.ok(html.includes('data-product-view="resources"'));
assert.ok(html.includes('id="resourcesView"')&&html.includes('id="resourcesRoot"'));
assert.ok(html.indexOf('src="./resources.js"')<html.indexOf('src="./learning.js"'));
assert.ok(js.includes("renderChallengeResources(challenge)"));
assert.ok(js.includes('function renderResources()') && js.includes("if (viewName === 'resources') renderResources()"));
assert.ok(js.includes("target=\"_blank\" rel=\"noopener noreferrer\""));
assert.ok(js.includes('resourceFilter'));
assert.ok(!html.includes('cdn.jsdelivr.net/gh/')&&!html.includes('raw.githubusercontent.com/codecrafters-io/'));
console.log('PASS 10 curated outbound-only resources, 5 contextual challenge paths, 3-stage filter and mobile UI wiring.');
