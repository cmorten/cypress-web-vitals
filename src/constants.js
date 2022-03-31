const DEFAULT_THRESHOLDS = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
};

const DEFAULT_FIRST_INPUT_SELECTOR = "body";

const SUPPORTED_BROWSERS = {
  Chrome: true,
  Chromium: true,
  Canary: true,
};

const WEB_VITALS_ACCESSOR_KEY = "__cy_web_vitals__";

const WEB_VITALS_SNIPPET = `<script type="module">import{getCLS,getFID,getLCP,getFCP,getTTFB}from"https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.js?module";(w=>{w.${WEB_VITALS_ACCESSOR_KEY}=w.${WEB_VITALS_ACCESSOR_KEY}||{};const e=new Event("${WEB_VITALS_ACCESSOR_KEY}");getCLS(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.cls=m;w.dispatchEvent(e)});getFID(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.fid=m;w.dispatchEvent(e)});getLCP(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.lcp=m;w.dispatchEvent(e)});getFCP(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.fcp=m;w.dispatchEvent(e)});getTTFB(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.ttfb=m;w.dispatchEvent(e)})})(window)</script>`;

const LOG_SLUG = "cy.vitals()";

const DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS = 10000;

module.exports = {
  DEFAULT_THRESHOLDS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  SUPPORTED_BROWSERS,
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_SNIPPET,
  LOG_SLUG,
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
};
