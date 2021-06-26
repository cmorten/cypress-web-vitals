const waitForPageLoad = () => {
  return cy.window({ log: false }).then(async (win) => {
    await new Promise((resolve) => {
      if (win.document.readyState === "complete") {
        resolve();
      } else {
        win.addEventListener("load", resolve, { once: true });
      }
    });

    return true;
  });
};

module.exports = waitForPageLoad;
