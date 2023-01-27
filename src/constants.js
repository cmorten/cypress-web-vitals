const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const DEFAULT_THRESHOLDS = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
};

const WEB_VITALS_KEYS = Object.keys(DEFAULT_THRESHOLDS);
const WEB_VITALS_KEYS_WITHOUT_CLS = WEB_VITALS_KEYS.filter(
  (vital) => vital !== "cls"
);

const DEFAULT_FIRST_INPUT_SELECTOR = "body";

const SUPPORTED_BROWSERS = {
  Chrome: true,
  Chromium: true,
  Canary: true,
};

const WEB_VITALS_ACCESSOR_KEY = "__cy_web_vitals__";

const WEB_VITALS_SCRIPT_FILE = path.join(
  path.dirname(require.resolve("web-vitals")),
  "web-vitals.iife.js"
);

const WEB_VITALS_CORE = fs.readFileSync(WEB_VITALS_SCRIPT_FILE, {
  encoding: "utf8",
});

const WEB_VITALS_REPORTING = minify(`
(w => {
  w.${WEB_VITALS_ACCESSOR_KEY} = w.${WEB_VITALS_ACCESSOR_KEY} || {};
  const e = new Event("${WEB_VITALS_ACCESSOR_KEY}");
  onCLS(m => { w.${WEB_VITALS_ACCESSOR_KEY}.cls=m; w.dispatchEvent(e) });
  onFID(m => { w.${WEB_VITALS_ACCESSOR_KEY}.fid=m; w.dispatchEvent(e) });
  onLCP(m => { w.${WEB_VITALS_ACCESSOR_KEY}.lcp=m; w.dispatchEvent(e) });
  onFCP(m => { w.${WEB_VITALS_ACCESSOR_KEY}.fcp=m; w.dispatchEvent(e) });
  onTTFB(m => { w.${WEB_VITALS_ACCESSOR_KEY}.ttfb=m; w.dispatchEvent(e) });
})(window)
`);

const WEB_VITALS_SNIPPET = `<script>${WEB_VITALS_CORE}${WEB_VITALS_REPORTING}</script>`;

const LOG_SLUG = "cy.vitals()";

const DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS = 10000;

module.exports = {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS,
  WEB_VITALS_SNIPPET,
};
