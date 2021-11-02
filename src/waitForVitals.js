const {
  WEB_VITALS_ACCESSOR_KEY,
  ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
} = require("./constants");

const allVitalsReported = (win, thresholds) => {
  const reports = win[WEB_VITALS_ACCESSOR_KEY];

  for (const key of Object.keys(thresholds)) {
    if (!reports[key]) {
      return false;
    }
  }

  return true;
};

const waitForVitals = (thresholds) => () => {
  return cy
    .window({ log: false })
    .then(
      { timeout: ALL_WEB_VITALS_REPORTED_TIMEOUT_MS + 1000 },
      async (win) => {
        await new Promise((resolve) => {
          let timeout;

          function handleWebVital() {
            if (allVitalsReported(win, thresholds)) {
              clearTimeout(timeout);
              resolve();
            }
          }

          if (allVitalsReported(win, thresholds)) {
            resolve();
          } else {
            win.addEventListener(WEB_VITALS_ACCESSOR_KEY, handleWebVital);

            timeout = setTimeout(() => {
              win.removeEventListener(WEB_VITALS_ACCESSOR_KEY, handleWebVital);
              resolve();
            }, ALL_WEB_VITALS_REPORTED_TIMEOUT_MS);
          }
        });

        return true;
      }
    );
};

module.exports = waitForVitals;
