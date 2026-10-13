# Python Atelier — Data Collection & Privacy Audit

**Audit date:** October 13, 2026  
**Scope:** Public files on the repository `main` branch, including the landing page, `app/` workbench, structured practice modules, consent implementation, and isolation service worker.  
**Method:** Static code review and GitHub deployment/source checks. **Not** a live-browser network interception test, independent third-party code review, penetration test, or legal opinion.

## Visitor data inventory

| Feature | Data | Destination | Necessary? |
| --- | --- | --- | --- |
| GitHub Pages hosting | Standard IP / browser / request metadata | GitHub Pages infrastructure | Required to serve page; cannot be stopped by site consent |
| Consent preferences (`pl.atelier.privacy.v1`) | Decision, timestamp, preference flags | Browser local storage | To remember choice; optional tracking remains uninstalled |
| Workspace (`pl.atelier.v2`, legacy `pl.atelier.v1`) | User-authored Python files, active file | Browser local storage | Editor autosave; export supported |
| Editor settings (`pl.atelier.v2.prefs`) | Font and editor options | Browser local storage | Functional |
| Console history (`pl.atelier.v2.hist`) | Recent entered commands | Browser local storage | Functional |
| Brand seal (`pl.atelier.v2.seal`) | User-supplied image | Browser local storage | Functional, optional feature |
| Learning (`pl.atelier.learning.v1`) | Challenge work, reflected answers, records, seeds | Browser local storage | Functional, user can export backup |
| COI service worker | Session restart flags; service-worker registration | Browser session storage / browser | Functional for interactive input; now loaded after privacy choice |
| Python runtime / editor enhancement | Standard requests for Pyodide and CodeMirror | jsDelivr | Required to run Python / enhance editor; initiated after visitor choice |
| User-written Python and installed packages | Whatever network requests user deliberately runs | Potentially third-party endpoints | Controlled by user's code; not an Atelier analytics feature |

## Verified in current repository source

- No Google Analytics, Tag Manager, Meta/Facebook pixel, advertising SDK, or application-owned collection endpoint observed in the reviewed public files.
- No account signup, application database, or payment collection found.
- Optional tracking controls default off before a decision; the current build installs **no** optional analytics/advertising tracker.
- A first-visit notice offers accept/reject/management, and a settings entry remains accessible thereafter; the floating Privacy Choices button was removed.
- Workbench boot, dynamic service-worker injection, and external Python/editor downloads wait for the privacy choice.
- Initial workspace write and page-hide persistence are guarded until a choice is made.
- The landing page, workbench, and policy use `<meta name="referrer" content="no-referrer">` to minimize referrer transmission.
- Source-level syntax checks and GitHub Pages deployment status are performed as part of release verification.

## Material residual risks / release blockers

1. **Shared origin:** This and Freedom Arkives share `https://pomegranatexlily.github.io`. Local storage is origin-scoped, **not path-isolated**. Scripts on either project can potentially access the other's browser local storage. Create separate domains/subdomains before accounts or sensitive data.
2. **Third-party executable code:** Pyodide and CodeMirror are fetched from jsDelivr, including JavaScript; CDN compromise/changes remain a supply-chain risk. For production hardening, self-host pinned, verified assets where practical, use integrity controls, and test regressions.
3. **User program networking:** User-run Python and packages may make network requests. No blanket guarantee can be made that code a user chooses to run never sends their data.
4. **Service-worker storage:** COI service worker and browser behavior require real-device verification, including first-run consent, reload, denial, and Safari standalone mode.
5. **Browser storage:** Locally saved work is available to scripts under the same origin and to anyone with access to the browser/device; it is not end-to-end encrypted.
6. **No live-traffic certification:** Real browser testing with Network tab / request logs must confirm request timing before and after each choice. Confirm CDN and host policies independently.
7. **Legal review:** Privacy policy and consent UI reflect inspected code only; a qualified privacy professional should review legal obligations and jurisdictional coverage before monetization.

## Manual acceptance tests

1. Private-window first visit: no overlay persists once accepted or rejected; landing **Settings** reopens preferences.
2. Open workbench in a fresh browser context: no jsDelivr or COI service-worker activity before choice; both choices allow programming normally afterward.
3. Enter code, close/reopen, verify autosave; export backup, verify restore according to documented limits.
4. Change settings after rejecting, verify optional tracker requests stay absent.
5. Inspect Network tab for every external request, referrer, cookies, and request ordering; inspect local/session storage keys.
6. Test first-run and repeat-visit behavior on iPhone Safari, iOS standalone, desktop Chrome, and Firefox.

**Change rule:** Before adding analytics, marketing, login, email collection, hosting/API infrastructure, subscriptions, or other processing, update the inventory, policies, and consent gates; complete live-network regression tests and seek legal review.
