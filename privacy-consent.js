(function () {
  "use strict";
  var KEY = "pl.atelier.privacy.v1";
  var VERSION = 1; // Increase and request consent again before introducing new trackers.
  var state = null;
  var callbacks = [];
  var overlay = null;
  var policyURL = new URL("privacy.html", document.currentScript.src).href;

  try {
    var previous = JSON.parse(localStorage.getItem(KEY) || "null");
    if (previous && previous.version === VERSION &&
        typeof previous.analytics === "boolean" &&
        typeof previous.marketing === "boolean") state = previous;
  } catch (error) { /* Storage may be unavailable; default to no optional tracking. */ }

  function optionalAllowed(category) {
    return Boolean(state && state[category] === true);
  }
  function afterDecision(callback) {
    if (typeof callback !== "function") return;
    if (state) callback();
    else callbacks.push(callback);
  }
  function save(analytics, marketing) {
    state = {
      version: VERSION,
      analytics: analytics === true,
      marketing: marketing === true,
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (error) {
      // A choice still applies during this visit if storage is disabled.
    }
    close();
    var queued = callbacks.splice(0);
    queued.forEach(function (fn) { fn(); });
    window.dispatchEvent(new CustomEvent("atelier-privacy-change", {
      detail: {analytics: state.analytics, marketing: state.marketing}
    }));
  }
  function close() {
    if (overlay) overlay.remove();
    overlay = null;
  }
  function button(text, variant, action) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.className = "ap-button " + variant;
    b.addEventListener("click", action);
    return b;
  }
  function paragraph(text) {
    var p = document.createElement("p");
    p.textContent = text;
    return p;
  }
  function heading(text) {
    var h = document.createElement("h2");
    h.textContent = text;
    h.id = "ap-heading";
    return h;
  }
  function openPreferences() {
    close();
    var backdrop = document.createElement("div");
    backdrop.className = "ap-backdrop";
    var dialog = document.createElement("section");
    dialog.className = "ap-panel";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "ap-heading");
    dialog.append(heading("Your privacy choices"));
    dialog.append(paragraph("Necessary browser storage keeps your Python files, settings, and learning record on this device. The site cannot run and autosave normally without it. This storage is not uploaded to our servers."));
    dialog.append(paragraph("Optional analytics and advertising trackers are not currently installed. If they are introduced, we will request fresh consent first."));
    var row = document.createElement("label");
    row.className = "ap-choice";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = optionalAllowed("analytics");
    var span = document.createElement("span");
    span.textContent = "Allow optional analytics if enabled under this consent version (currently inactive)";
    row.append(checkbox, span);
    dialog.append(row);
    var actions = document.createElement("div");
    actions.className = "ap-actions";
    actions.append(
      button("Reject optional", "ap-neutral", function () { save(false, false); }),
      button("Save choices", "ap-primary", function () { save(checkbox.checked, false); })
    );
    dialog.append(actions);
    var link = document.createElement("a");
    link.href = policyURL;
    link.textContent = "Read privacy policy";
    link.className = "ap-policy-link";
    dialog.append(link);
    backdrop.append(dialog);
    document.body.append(backdrop);
    overlay = backdrop;
    checkbox.focus();
  }
  function openNotice() {
    close();
    var backdrop = document.createElement("div");
    backdrop.className = "ap-backdrop";
    var dialog = document.createElement("section");
    dialog.className = "ap-panel";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "ap-heading");
    dialog.append(heading("Privacy & browser storage"));
    dialog.append(paragraph("Python Atelier stores code, settings, and practice progress locally on your device. We currently use no optional analytics or advertising trackers. The app downloads essential programming libraries when started."));
    dialog.append(paragraph("You can reject optional tracking and still use Atelier. Website hosting and essential library downloads may involve standard connection data; see the privacy policy."));
    var actions = document.createElement("div");
    actions.className = "ap-actions";
    actions.append(
      button("Reject optional", "ap-neutral", function () { save(false, false); }),
      button("Accept all", "ap-primary", function () { save(true, true); }),
      button("Manage choices", "ap-outline", openPreferences)
    );
    dialog.append(actions);
    var link = document.createElement("a");
    link.href = policyURL;
    link.textContent = "Read privacy policy";
    link.className = "ap-policy-link";
    dialog.append(link);
    backdrop.append(dialog);
    document.body.append(backdrop);
    overlay = backdrop;
    var first = dialog.querySelector("button");
    if (first) first.focus();
  }
  function setup() {
    var css = document.createElement("style");
    css.textContent =
      ".ap-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.72);display:flex;align-items:flex-end;justify-content:center;padding:16px;overflow:auto;font:15px/1.55 system-ui,sans-serif}" +
      ".ap-panel{box-sizing:border-box;max-height:calc(100dvh - 32px);overflow:auto;width:min(620px,100%);background:#171318;color:#f5efeb;border:1px solid #9f7881;border-radius:18px;padding:22px;box-shadow:0 18px 60px #000a}" +
      ".ap-panel h2{font:700 23px/1.2 system-ui,sans-serif;letter-spacing:0;margin:0 0 14px;color:#fff}" +
      ".ap-panel p{font:14px/1.6 system-ui,sans-serif;color:#ddd0d3;margin:9px 0}" +
      ".ap-actions{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 12px}" +
      ".ap-button{font:650 14px system-ui,sans-serif;border-radius:10px;border:1px solid #aa7887;padding:12px 15px;min-height:44px;cursor:pointer}" +
      ".ap-button:focus-visible,.ap-policy-link:focus-visible{outline:3px solid #f2c572;outline-offset:3px}" +
      ".ap-primary{background:#a62f51;color:#fff;border-color:#d25c7f}.ap-neutral{background:#f3eef0;color:#261620;border-color:#f3eef0}.ap-outline{background:transparent;color:#fff}" +
      ".ap-policy-link{display:inline-block;color:#f7d1db;font:600 14px system-ui,sans-serif;margin:4px 0 0}" +
      ".ap-choice{display:flex;align-items:flex-start;gap:12px;padding:12px 0;font:14px/1.5 system-ui,sans-serif;color:#fff}" +
      ".ap-choice input{width:18px;height:18px;flex:none;margin:3px 0 0;accent-color:#b74969}" +
      "@media(min-width:600px){.ap-backdrop{align-items:center}.ap-panel{padding:28px}}" +
      "@media(max-width:420px){.ap-actions{display:grid;grid-template-columns:1fr 1fr}.ap-outline{grid-column:1/-1}.ap-button{padding:12px 9px}}";
    document.head.append(css);
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-privacy-settings]");
      if (!target) return;
      event.preventDefault();
      var settingsDialog = document.getElementById("sd");
      if (settingsDialog && settingsDialog.open) settingsDialog.close();
      openPreferences();
    });
    if (!state) openNotice();
  }
  window.AtelierPrivacy = Object.freeze({
    afterDecision: afterDecision,
    hasDecision: function () { return Boolean(state); },
    optionalAllowed: optionalAllowed,
    openPreferences: openPreferences
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, {once:true});
  else setup();
})();
