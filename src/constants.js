const DEFAULT_THRESHOLDS = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
};

const WEB_VITALS_KEYS = Object.keys(DEFAULT_THRESHOLDS);
const WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP = WEB_VITALS_KEYS.filter(
  (vital) => !["cls", "fid", "lcp"].includes(vital)
);

const DEFAULT_FIRST_INPUT_SELECTOR = "body";

const DEFAULT_STRICT_MODE = false;

const SUPPORTED_BROWSERS = {
  Chrome: true,
  Chromium: true,
  Canary: true,
};

const WEB_VITALS_ACCESSOR_KEY = "__cy_web_vitals__";

// https://unpkg.com/web-vitals@3.1.1/dist/web-vitals.iife.js
const WEB_VITALS_CORE = `var webVitals=function(e){"use strict";var n,t,r,i,o,a=-1,c=function(e){addEventListener("pageshow",(function(n){n.persisted&&(a=n.timeStamp,e(n))}),!0)},u=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},f=function(){var e=u();return e&&e.activationStart||0},s=function(e,n){var t=u(),r="navigate";return a>=0?r="back-forward-cache":t&&(r=document.prerendering||f()>0?"prerender":document.wasDiscarded?"restore":t.type.replace(/_/g,"-")),{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},d=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries())}))}));return r.observe(Object.assign({type:e,buffered:!0},t||{})),r}}catch(e){}},l=function(e,n,t,r){var i,o;return function(a){n.value>=0&&(a||r)&&((o=n.value-(i||0))||void 0===i)&&(i=n.value,n.delta=o,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n))}},v=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},p=function(e){var n=function(n){"pagehide"!==n.type&&"hidden"!==document.visibilityState||e(n)};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},m=function(e){var n=!1;return function(t){n||(e(t),n=!0)}},h=-1,g=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},y=function(e){"hidden"===document.visibilityState&&h>-1&&(h="visibilitychange"===e.type?e.timeStamp:0,E())},T=function(){addEventListener("visibilitychange",y,!0),addEventListener("prerenderingchange",y,!0)},E=function(){removeEventListener("visibilitychange",y,!0),removeEventListener("prerenderingchange",y,!0)},C=function(){return h<0&&(h=g(),T(),c((function(){setTimeout((function(){h=g(),T()}),0)}))),{get firstHiddenTime(){return h}}},L=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},b=function(e,n){n=n||{},L((function(){var t,r=[1800,3e3],i=C(),o=s("FCP"),a=d("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(a.disconnect(),e.startTime<i.firstHiddenTime&&(o.value=Math.max(e.startTime-f(),0),o.entries.push(e),t(!0)))}))}));a&&(t=l(e,o,r,n.reportAllChanges),c((function(i){o=s("FCP"),t=l(e,o,r,n.reportAllChanges),v((function(){o.value=performance.now()-i.timeStamp,t(!0)}))})))}))},w=function(e,n){n=n||{},b(m((function(){var t,r=[.1,.25],i=s("CLS",0),o=0,a=[],u=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=a[0],t=a[a.length-1];o&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(o+=e.value,a.push(e)):(o=e.value,a=[e])}})),o>i.value&&(i.value=o,i.entries=a,t())},f=d("layout-shift",u);f&&(t=l(e,i,r,n.reportAllChanges),p((function(){u(f.takeRecords()),t(!0)})),c((function(){o=0,i=s("CLS",0),t=l(e,i,r,n.reportAllChanges),v((function(){return t()}))})),setTimeout(t,0))})))},S={passive:!0,capture:!0},P=new Date,I=function(e,i){n||(n=i,t=e,r=new Date,M(removeEventListener),A())},A=function(){if(t>=0&&t<r-P){var e={entryType:"first-input",name:n.type,target:n.target,cancelable:n.cancelable,startTime:n.timeStamp,processingStart:n.timeStamp+t};i.forEach((function(n){n(e)})),i=[]}},F=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){I(e,n),i()},r=function(){i()},i=function(){removeEventListener("pointerup",t,S),removeEventListener("pointercancel",r,S)};addEventListener("pointerup",t,S),addEventListener("pointercancel",r,S)}(n,e):I(n,e)}},M=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,F,S)}))},D=function(e,r){r=r||{},L((function(){var o,a=[100,300],u=C(),f=s("FID"),v=function(e){e.startTime<u.firstHiddenTime&&(f.value=e.processingStart-e.startTime,f.entries.push(e),o(!0))},h=function(e){e.forEach(v)},g=d("first-input",h);o=l(e,f,a,r.reportAllChanges),g&&p(m((function(){h(g.takeRecords()),g.disconnect()}))),g&&c((function(){var c;f=s("FID"),o=l(e,f,a,r.reportAllChanges),i=[],t=-1,n=null,M(addEventListener),c=v,i.push(c),A()}))}))},k=0,B=1/0,x=0,R=function(e){e.forEach((function(e){e.interactionId&&(B=Math.min(B,e.interactionId),x=Math.max(x,e.interactionId),k=x?(x-B)/7+1:0)}))},H=function(){return o?k:performance.interactionCount||0},N=function(){"interactionCount"in performance||o||(o=d("event",R,{type:"event",buffered:!0,durationThreshold:0}))},O=0,_=function(){return H()-O},j=[],q={},V=function(e){var n=j[j.length-1],t=q[e.interactionId];if(t||j.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else{var r={id:e.interactionId,latency:e.duration,entries:[e]};q[r.id]=r,j.push(r)}j.sort((function(e,n){return n.latency-e.latency})),j.splice(10).forEach((function(e){delete q[e.id]}))}},z=function(e,n){n=n||{},L((function(){var t=[200,500];N();var r,i=s("INP"),o=function(e){e.forEach((function(e){(e.interactionId&&V(e),"first-input"===e.entryType)&&(!j.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&V(e))}));var n,t=(n=Math.min(j.length-1,Math.floor(_()/50)),j[n]);t&&t.latency!==i.value&&(i.value=t.latency,i.entries=t.entries,r())},a=d("event",o,{durationThreshold:n.durationThreshold||40});r=l(e,i,t,n.reportAllChanges),a&&(a.observe({type:"first-input",buffered:!0}),p((function(){o(a.takeRecords()),i.value<0&&_()>0&&(i.value=0,i.entries=[]),r(!0)})),c((function(){j=[],O=H(),i=s("INP"),r=l(e,i,t,n.reportAllChanges)})))}))},G={},J=function(e,n){n=n||{},L((function(){var t,r=[2500,4e3],i=C(),o=s("LCP"),a=function(e){var n=e[e.length-1];if(n){var r=Math.max(n.startTime-f(),0);r<i.firstHiddenTime&&(o.value=r,o.entries=[n],t())}},u=d("largest-contentful-paint",a);if(u){t=l(e,o,r,n.reportAllChanges);var h=m((function(){G[o.id]||(a(u.takeRecords()),u.disconnect(),G[o.id]=!0,t(!0))}));["keydown","click"].forEach((function(e){addEventListener(e,h,!0)})),p(h),c((function(i){o=s("LCP"),t=l(e,o,r,n.reportAllChanges),v((function(){o.value=performance.now()-i.timeStamp,G[o.id]=!0,t(!0)}))}))}}))},K=function e(n){document.prerendering?L((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},Q=function(e,n){n=n||{};var t=[800,1800],r=s("TTFB"),i=l(e,r,t,n.reportAllChanges);K((function(){var o=u();if(o){var a=o.responseStart;if(a<=0||a>performance.now())return;r.value=Math.max(a-f(),0),r.entries=[o],i(!0),c((function(){r=s("TTFB",0),(i=l(e,r,t,n.reportAllChanges))(!0)}))}}))};return e.getCLS=w,e.getFCP=b,e.getFID=D,e.getINP=z,e.getLCP=J,e.getTTFB=Q,e.onCLS=w,e.onFCP=b,e.onFID=D,e.onINP=z,e.onLCP=J,e.onTTFB=Q,Object.defineProperty(e,"__esModule",{value:!0}),e}({});`;

const WEB_VITALS_REPORTING = `
(w => {
  w.${WEB_VITALS_ACCESSOR_KEY} = w.${WEB_VITALS_ACCESSOR_KEY} || {};
  const e = new Event("${WEB_VITALS_ACCESSOR_KEY}");
  webVitals.onCLS(m => { console.log("CLS", m); w.${WEB_VITALS_ACCESSOR_KEY}.cls=m; w.dispatchEvent(e) });
  webVitals.onFID(m => { console.log("FID", m); w.${WEB_VITALS_ACCESSOR_KEY}.fid=m; w.dispatchEvent(e) });
  webVitals.onLCP(m => { console.log("LCP", m); w.${WEB_VITALS_ACCESSOR_KEY}.lcp=m; w.dispatchEvent(e) });
  webVitals.onFCP(m => { console.log("FCP", m); w.${WEB_VITALS_ACCESSOR_KEY}.fcp=m; w.dispatchEvent(e) });
  webVitals.onTTFB(m => { console.log("TTFB", m); w.${WEB_VITALS_ACCESSOR_KEY}.ttfb=m; w.dispatchEvent(e) });
})(window)
`;

const WEB_VITALS_SNIPPET = `<script>${WEB_VITALS_CORE}${WEB_VITALS_REPORTING}</script>`;

const LOG_SLUG = "cy.vitals()";

const DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS = 10000;

module.exports = {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_STRICT_MODE,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP,
  WEB_VITALS_SNIPPET,
};
