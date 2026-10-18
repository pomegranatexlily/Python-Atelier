'use strict';
/* Curated external study links identified from the founder-provided repository video.
 * External links only: never import or execute third-party repository code.
 * Distinct from graded CS50P challenges and from learner-specific progress.
 */
(() => {
  const entries = [
    {
      id: 'freecodecamp', title: 'freeCodeCamp', category: 'Start here', difficulty: 'Beginner',
      url: 'https://github.com/freeCodeCamp/freeCodeCamp',
      source: 'freeCodeCamp/freeCodeCamp',
      reason: 'Free beginner lessons to learn the concepts beside Atelier.',
      exercise: 'After studying a topic, reproduce one small example from memory in your own .py file.',
      appliesTo: ['Atelier'],
      challengeIds: ['name-greeting', 'indoor-voice', 'tip-calculator']
    },
    {
      id: 'free-programming-books', title: 'Free Programming Books', category: 'Start here', difficulty: 'Beginner',
      url: 'https://github.com/EbookFoundation/free-programming-books',
      source: 'EbookFoundation/free-programming-books',
      reason: 'A directory of freely available programming books and courses, including Python.',
      exercise: 'Read one short Python section; write an example in Atelier and explain the output.',
      appliesTo: ['Atelier'],
      challengeIds: ['indoor-voice', 'playback-speed']
    },
    {
      id: 'python-roadmap', title: 'Developer Roadmaps · Python', category: 'Start here', difficulty: 'Beginner to intermediate',
      url: 'https://roadmap.sh/python',
      source: 'roadmap.sh (Developer Roadmap project)',
      reason: 'Map which Python fundamentals to learn next without adding another giant course.',
      exercise: 'Choose one concept you have not covered, then explore it in an independent file.',
      appliesTo: ['Atelier', 'Career planning'],
      challengeIds: ['file-extension', 'tip-calculator']
    },
    {
      id: 'project-based-learning', title: 'Project-Based Learning', category: 'Build projects', difficulty: 'Beginner to advanced',
      url: 'https://github.com/practical-tutorials/project-based-learning',
      source: 'practical-tutorials/project-based-learning',
      reason: 'Tutorials organized by language and projects. Learn by building rather than memorizing.',
      exercise: 'Pick a short Python project, break it into three tasks, and build a tiny original version.',
      appliesTo: ['Atelier', 'POM', 'Packet Lily'],
      challengeIds: ['file-extension', 'tip-calculator']
    },
    {
      id: 'public-apis', title: 'Public APIs', category: 'Build projects', difficulty: 'Intermediate',
      url: 'https://github.com/public-apis/public-apis',
      source: 'public-apis/public-apis',
      reason: 'Examples of public data services that can inspire Python JSON, HTTP and parsing exercises.',
      exercise: 'Study a sample JSON response first. A live API request may need network access, CORS permission or a key.',
      appliesTo: ['Atelier', 'POM'],
      challengeIds: ['file-extension']
    },
    {
      id: 'awesome-python', title: 'Awesome Python', category: 'Build projects', difficulty: 'Intermediate',
      url: 'https://github.com/vinta/awesome-python',
      source: 'vinta/awesome-python',
      reason: 'Explore libraries by problem: parsing, automation, testing, data and web tools.',
      exercise: 'Choose a library, then check whether it supports Pyodide before attempting to install it in this browser.',
      appliesTo: ['Atelier', 'POM'],
      challengeIds: ['file-extension']
    },
    {
      id: 'build-your-own-x', title: 'Build Your Own X', category: 'Later', difficulty: 'Advanced',
      url: 'https://github.com/codecrafters-io/build-your-own-x',
      source: 'codecrafters-io/build-your-own-x',
      reason: 'Rebuild small versions of systems to learn how they work. Good after Python basics.',
      exercise: 'Start with a small interpreter or command tool only after file handling and functions feel comfortable.',
      appliesTo: ['Atelier', 'POM'],
      challengeIds: []
    },
    {
      id: 'system-design-primer', title: 'System Design Primer', category: 'Later', difficulty: 'Advanced',
      url: 'https://github.com/donnemartin/system-design-primer',
      source: 'donnemartin/system-design-primer',
      reason: 'Architecture, scaling, caching and failure scenarios. More relevant to POM and Packet Lily than early Python drills.',
      exercise: 'Diagram a client, an API gateway, a worker and a database; label possible failure points.',
      appliesTo: ['POM', 'Packet Lily'],
      challengeIds: []
    },
    {
      id: 'coding-interview-university', title: 'Coding Interview University', category: 'Later', difficulty: 'Advanced',
      url: 'https://github.com/jwasham/coding-interview-university',
      source: 'jwasham/coding-interview-university',
      reason: 'A long computer science interview curriculum. Useful for career preparation, not the next lesson.',
      exercise: 'Study one algorithm after Python basics; implement and test it without copying a solution.',
      appliesTo: ['Career planning', 'Atelier'],
      challengeIds: []
    },
    {
      id: 'awesome', title: 'Awesome (meta-directory)', category: 'Later', difficulty: 'All levels',
      url: 'https://github.com/sindresorhus/awesome',
      source: 'sindresorhus/awesome',
      reason: 'Directories of curated topic lists. Great for discovery, but too broad for a beginner learning path.',
      exercise: 'Use it only when you have a specific topic to research.',
      appliesTo: ['Atelier', 'POM', 'Packet Lily'],
      challengeIds: []
    }
  ];
  window.AtelierResources = Object.freeze({
    entries: Object.freeze(entries.map(entry => Object.freeze({
      ...entry,
      challengeIds: Object.freeze(entry.challengeIds),
      appliesTo: Object.freeze(entry.appliesTo)
    }))),
    categories: Object.freeze(['Start here', 'Build projects', 'Later'])
  });
})();
