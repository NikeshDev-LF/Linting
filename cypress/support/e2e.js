// Ignore benign cross-origin "Script error." exceptions from third-party scripts
Cypress.on('uncaught:exception', err => {
  // Ignore generic cross-origin errors
  if (err && /Script error\.?/i.test(err.message)) {
    return false;
  }
  // Ignore known adplus error shape
  if (
    err &&
    /adplus/i.test(err.stack || '') &&
    /setup is not a function/i.test(err.message || '')
  ) {
    return false;
  }
  // let other errors fail the test
});
