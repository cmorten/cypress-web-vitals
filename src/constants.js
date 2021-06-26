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

const WEB_VITALS_SNIPPET = `<script type="module">
import {getCLS,getFID,getLCP,getFCP,getTTFB} from "https://unpkg.com/web-vitals?module";
window.${WEB_VITALS_ACCESSOR_KEY}=window.${WEB_VITALS_ACCESSOR_KEY}||{};
getCLS(m=>{window.${WEB_VITALS_ACCESSOR_KEY}.cls=m;console.log(m);});
getFID(m=>{window.${WEB_VITALS_ACCESSOR_KEY}.fid=m;console.log(m);});
getLCP(m=>{window.${WEB_VITALS_ACCESSOR_KEY}.lcp=m;console.log(m);});
getFCP(m=>{window.${WEB_VITALS_ACCESSOR_KEY}.fcp=m;console.log(m);});
getTTFB(m=>{window.${WEB_VITALS_ACCESSOR_KEY}.ttfb=m;console.log(m);});
</script>`;

const LOG_SLUG = "cy.vitals()";

const DELAY_MS_FOR_CLS_REPORTING = 100;

module.exports = {
  DEFAULT_THRESHOLDS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  SUPPORTED_BROWSERS,
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_SNIPPET,
  LOG_SLUG,
  DELAY_MS_FOR_CLS_REPORTING,
};
