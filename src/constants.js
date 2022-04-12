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

const WEB_VITALS_CORE = `var e,t,n,i,r=function(e,t){return{name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},a=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var n=new PerformanceObserver(function(e){return e.getEntries().map(t)});return n.observe({type:e,buffered:!0}),n}}catch(e){}},o=function(t,n){function i(e){"pagehide"!==e.type&&"hidden"!==document.visibilityState||(t(e),n&&(removeEventListener("visibilitychange",i,!0),removeEventListener("pagehide",i,!0)))}addEventListener("visibilitychange",i,!0),addEventListener("pagehide",i,!0)},u=function(t){addEventListener("pageshow",function(e){e.persisted&&t(e)},!0)},c=function(t,n,i){var r;return function(e){0<=n.value&&(e||i)&&(n.delta=n.value-(r||0),!n.delta&&void 0!==r||(r=n.value,t(n)))}},f=-1,s=function(){return"hidden"===document.visibilityState?0:1/0},m=function(){o(function(e){e=e.timeStamp;f=e},!0)},v=function(){return f<0&&(f=s(),m(),u(function(){setTimeout(function(){f=s(),m()},0)})),{get firstHiddenTime(){return f}}},getFCP=function(t,n){function e(e){"first-contentful-paint"===e.name&&(m&&m.disconnect(),e.startTime<o.firstHiddenTime&&(f.value=e.startTime,f.entries.push(e),i(!0)))}var i,o=v(),f=r("FCP"),s=window.performance&&performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],m=s?null:a("paint",e);(s||m)&&(i=c(t,f,n),s&&e(s),u(function(e){f=r("FCP"),i=c(t,f,n),requestAnimationFrame(function(){requestAnimationFrame(function(){f.value=performance.now()-e.timeStamp,i(!0)})})}))},p=!1,l=-1,getCLS=function(t,e){p||(getFCP(function(e){l=e.value}),p=!0);function n(e){-1<l&&t(e)}function i(e){var t,n;e.hadRecentInput||(t=v[0],n=v[v.length-1],m&&e.startTime-n.startTime<1e3&&e.startTime-t.startTime<5e3?(m+=e.value,v.push(e)):(m=e.value,v=[e]),m>s.value&&(s.value=m,s.entries=v,f()))}var f,s=r("CLS",0),m=0,v=[],d=a("layout-shift",i);d&&(f=c(n,s,e),o(function(){d.takeRecords().map(i),f(!0)}),u(function(){l=-1,s=r("CLS",m=0),f=c(n,s,e)}))},T={passive:!0,capture:!0},y=new Date,g=function(i,r){e||(e=r,t=i,n=new Date,w(removeEventListener),E())},E=function(){var r;0<=t&&t<n-y&&(r={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t},i.forEach(function(e){e(r)}),i=[])},S=function(e){var t,n,i,r;function a(){g(n,i),r()}function o(){r()}e.cancelable&&(t=(1e12<e.timeStamp?new Date:performance.now())-e.timeStamp,"pointerdown"==e.type?(n=t,i=e,r=function(){removeEventListener("pointerup",a,T),removeEventListener("pointercancel",o,T)},addEventListener("pointerup",a,T),addEventListener("pointercancel",o,T)):g(t,e))},w=function(t){["mousedown","keydown","touchstart","pointerdown"].forEach(function(e){return t(e,S,T)})},getFID=function(n,f){function s(e){e.startTime<m.firstHiddenTime&&(p.value=e.processingStart-e.startTime,p.entries.push(e),l(!0))}var m=v(),p=r("FID"),d=a("first-input",s),l=c(n,p,f);d&&o(function(){d.takeRecords().map(s),d.disconnect()},!0),d&&u(function(){p=r("FID"),l=c(n,p,f),i=[],t=-1,e=null,w(addEventListener),i.push(s),E()})},b={},getLCP=function(t,n){function e(e){var t=e.startTime;t<s.firstHiddenTime&&(m.value=t,m.entries.push(e),i())}var i,f,s=v(),m=r("LCP"),p=a("largest-contentful-paint",e);p&&(i=c(t,m,n),f=function(){b[m.id]||(p.takeRecords().map(e),p.disconnect(),b[m.id]=!0,i(!0))},["keydown","click"].forEach(function(e){addEventListener(e,f,{once:!0,capture:!0})}),o(f,!0),u(function(e){m=r("LCP"),i=c(t,m,n),requestAnimationFrame(function(){requestAnimationFrame(function(){m.value=performance.now()-e.timeStamp,b[m.id]=!0,i(!0)})})}))},getTTFB=function(t){var n=r("TTFB"),e=function(){try{var e=performance.getEntriesByType("navigation")[0]||function(){var e,t=performance.timing,n={entryType:"navigation",startTime:0};for(e in t)"navigationStart"!==e&&"toJSON"!==e&&(n[e]=Math.max(t[e]-t.navigationStart,0));return n}();if(n.value=n.delta=e.responseStart,n.value<0||n.value>performance.now())return;n.entries=[e],t(n)}catch(e){}};"complete"===document.readyState?setTimeout(e,0):addEventListener("load",function(){return setTimeout(e,0)})};`;

const WEB_VITALS_SNIPPET = `<script type="module">${WEB_VITALS_CORE}(w=>{w.${WEB_VITALS_ACCESSOR_KEY}=w.${WEB_VITALS_ACCESSOR_KEY}||{};const e=new Event("${WEB_VITALS_ACCESSOR_KEY}");getCLS(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.cls=m;w.dispatchEvent(e)});getFID(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.fid=m;w.dispatchEvent(e)});getLCP(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.lcp=m;w.dispatchEvent(e)});getFCP(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.fcp=m;w.dispatchEvent(e)});getTTFB(m=>{w.${WEB_VITALS_ACCESSOR_KEY}.ttfb=m;w.dispatchEvent(e)})})(window)</script>`;

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
