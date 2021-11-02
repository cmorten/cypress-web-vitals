const { WEB_VITALS_ACCESSOR_KEY } = require("./constants");

const allVitalsReported = (win, thresholds) => {
  const reports = win[WEB_VITALS_ACCESSOR_KEY];

  if (!reports) {
    return false;
  }

  for (const key of Object.keys(thresholds)) {
    if (!reports[key]) {
      return false;
    }
  }

  return true;
};

const waitForVitals =
  ({ thresholds, vitalsReportedTimeout }) =>
  () => {
    return cy
      .window({ log: false })
      .then({ timeout: vitalsReportedTimeout + 1000 }, async (win) => {
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
            }, vitalsReportedTimeout);
          }
        });

        return true;
      });
  };

module.exports = waitForVitals;
