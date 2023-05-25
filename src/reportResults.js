const {
  WEB_VITALS_ACCESSOR_KEY,
  WEB_VITALS_KEYS,
  LOG_SLUG,
} = require("./constants");

const reportResults =
  ({ onReport, strict, thresholds }) =>
  () => {
    const errors = [];
    const results = [];
    const report = {
      strict,
      thresholds,
      results: {},
    };

    return cy.window({ log: false }).then(async (win) => {
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
          if (strict) {
            const message = `${vital} web-vital could not be calculated in strict mode, and threshold was ${threshold}. Fail.`;

            results.push(message);
            errors.push(message);
          } else {
            results.push(
              `${vital} web-vital could not be calculated, and threshold was ${threshold}. Skipping...`
            );
          }
        } else if (metric > threshold) {
          const message = `${vital} web-vital is ${metric}, and is over the ${threshold} threshold. Fail.`;

          results.push(message);
          errors.push(message);
        } else {
          results.push(
            `${vital} web-vital is ${metric}, and threshold was ${threshold}. Pass.`
          );
        }
      }

      if (results.length) {
        cy.log(`-------- ${LOG_SLUG} --------`);
        results.forEach((result) => cy.log(result));
        cy.log("-----------------------------");
      }

      if (onReport) {
        cy.wrap(null, { log: false }).then(async () => await onReport(report));
      }

      if (errors.length) {
        const formattedErrors = `\n\n${errors.join("\n")}`;

        const message =
          errors.length === 1
            ? `${LOG_SLUG} - A threshold has been crossed${
                strict ? " or a metric could not be calculated" : ""
              }.${formattedErrors}`
            : `${LOG_SLUG} - Some thresholds have been crossed${
                strict ? " or some metrics could not be calculated" : ""
              }.${formattedErrors}`;

        return cy.wrap(message, { log: false, timeout: 0 }).then((m) => {
          throw new Error(m);
        });
      }
    });
  };

module.exports = reportResults;
