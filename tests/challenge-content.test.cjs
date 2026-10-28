'use strict';
// Guard the learner-facing source text against literal backslash-n artifacts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('app/challenges.js', 'utf8'), context, { filename: 'app/challenges.js' });
const challenges = context.window.AtelierChallenges.challenges;
assert.equal(challenges.length, 5, 'CS50P Foundations must retain all five challenges');
for (const challenge of challenges) {
  assert(challenge.starterCode.includes('\n'), challenge.id + ' starter code should contain real line breaks');
  assert.equal(challenge.starterCode.includes('\\n'), false, challenge.id + ' starter code must not display literal backslash-n text');
  assert(challenge.starterCode.endsWith('\n\n'), challenge.id + ' starter code should leave a blank line for learner code');
}

const controller = fs.readFileSync('app/learning.js', 'utf8');
const start = controller.indexOf('function renderChallengeDetail');
const end = controller.indexOf('function wirePracticeDetail', start);
assert(start >= 0 && end > start, 'Challenge example renderer must exist');
const renderer = controller.slice(start, end);
assert(renderer.includes('Input\\n'), 'Example label must use a real line break after Input');
assert(renderer.includes("exampleInput.join('\\n')"), 'Multiple example inputs must be displayed on separate lines');
assert(renderer.includes('Expected behavior\\n'), 'Expected-behavior label must use a real line break');
assert.equal(renderer.includes('Input\\\\n'), false, 'Renderer must not contain a double-escaped Input newline');
assert.equal(renderer.includes("exampleInput.join('\\\\n')"), false, 'Renderer must not join inputs with literal backslash-n');

console.log('Python Atelier challenge content: five starter files and multiline example formatting passed.');
