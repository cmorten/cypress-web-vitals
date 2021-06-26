const { WEB_VITALS_ACCESSOR_KEY, LOG_SLUG } = require("./constants");

const reportResults = (thresholds) => () => {
  const errors = [];
  const results = [];

  return cy.window({ log: false }).then((win) => {
    Object.entries(thresholds).forEach(([key, threshold]) => {
      try {
        const metric = win[WEB_VITALS_ACCESSOR_KEY][key].value;

        if (metric > threshold) {
          errors.push(
            `${key} web-vital is ${metric}, and is over the ${threshold} threshold.`
          );
        } else {
          results.push(
            `${key} web-vital is ${metric}, and threshold was ${threshold}.`
          );
        }
      } catch (e) {
        results.push(
          `${key} web-vital could not be calculated, and threshold was ${threshold}. Skipping...`
        );
      }
    });

    if (results.length) {
      cy.log(`-------- ${LOG_SLUG} --------`);
      results.forEach((result) => cy.log(result));
      cy.log("-----------------------------");
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
