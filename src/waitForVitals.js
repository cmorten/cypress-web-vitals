const { WEB_VITALS_ACCESSOR_KEY } = require("./constants");

const allVitalsReported = (win, vitals) => {
  const reports = win[WEB_VITALS_ACCESSOR_KEY];

  if (!reports) {
    return false;
  }

  for (const key of vitals) {
    if (!reports[key]) {
      return false;
    }
  }

  return true;
};

const waitForVitals =
  ({ vitals, vitalsReportedTimeout }) =>
  () => {
    return cy
      .window({ log: false })
      .then({ timeout: vitalsReportedTimeout + 1000 }, async (win) => {
        await new Promise((resolve) => {
          let timeout;

          function handleWebVital() {
            if (allVitalsReported(win, vitals)) {
              clearTimeout(timeout);
              resolve();
            }
          }

          if (allVitalsReported(win, vitals)) {
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
