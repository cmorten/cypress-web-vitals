const {
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_KEYS,
  LOG_SLUG,
} = require("./constants");

const reportResults =
  ({ thresholds, onReport }) =>
  () => {
    const errors = [];
    const results = [];
    const report = {
      thresholds,
      results: {},
    };

    return cy.window({ log: false }).then((win) => {
      for (const vital of WEB_VITALS_KEYS) {
        const threshold = thresholds[vital];
        const vitalUsed = typeof threshold !== "undefined";

        let metric = null;

        try {
          metric = win[WEB_VITALS_ACCESSOR_KEY][vital].value;
        } catch (_) {
          // ignore
        }

        report.results[vital] = metric;

        if (!vitalUsed) {
          continue;
        }

        if (metric === null) {
          results.push(
            `${vital} web-vital could not be calculated, and threshold was ${threshold}. Skipping...`
          );
        } else if (metric > threshold) {
          const message = `${vital} web-vital is ${metric}, and is over the ${threshold} threshold.`;

          results.push(message);
          errors.push(message);
        } else {
          results.push(
            `${vital} web-vital is ${metric}, and threshold was ${threshold}.`
          );
        }
      }

      if (results.length) {
        cy.log(`-------- ${LOG_SLUG} --------`);
        results.forEach((result) => cy.log(result));
        cy.log("-----------------------------");
      }

      if (onReport) {
        onReport(report);
      }

      if (errors.length) {
        const formattedErrors = `\n\n${errors.join("\n")}`;

        const message =
          errors.length === 1
            ? `${LOG_SLUG} - A threshold has been crossed.${formattedErrors}`
            : `${LOG_SLUG} - Some thresholds have been crossed.${formattedErrors}`;

        throw new Error(message);
      }
    });
  };

module.exports = reportResults;
