export class PracticeFormPage {
  constructor() {
    this.locators = {
      firstName: '#firstName',
      lastName: '#lastName',
      email: '#userEmail',
      genderWrapper: '#genterWrapper',
      mobile: '#userNumber',
      dateOfBirthInput: '#dateOfBirthInput',
      subjectsInput: '#subjectsInput',
      hobbiesWrapper: '#hobbiesWrapper',
      uploadPicture: '#uploadPicture',
      currentAddress: '#currentAddress',
      stateContainer: '#state',
      cityContainer: '#city',
      stateInput: '#react-select-3-input',
      cityInput: '#react-select-4-input',
      submit: '#submit',
      modalTitle: '.modal-title',
    };
  }

  visit() {
    cy.visit('/automation-practice-form');
  }

  fillFirstName(value) {
    cy.get(this.locators.firstName).clear().type(value);
  }

  fillLastName(value) {
    cy.get(this.locators.lastName).clear().type(value);
  }

  fillEmail(value) {
    cy.get(this.locators.email).clear().type(value);
  }

  selectGender(text) {
    cy.get(this.locators.genderWrapper).contains('label', text).click();
  }

  fillMobile(value) {
    cy.get(this.locators.mobile).clear().type(value);
  }

  setDateOfBirth(birthDateStr) {
    const [y, m, d] = birthDateStr.split('-').map(Number);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const formatted = `${String(d).padStart(2, '0')} ${monthNames[m - 1]} ${y}`;
    cy.get(this.locators.dateOfBirthInput)
      .click()
      .type('{selectall}')
      .type(`${formatted}{enter}`);
  }

  addSubject(subject) {
    cy.get(this.locators.subjectsInput).type(subject + '{enter}');
  }

  selectHobby(text) {
    cy.get(this.locators.hobbiesWrapper).contains('label', text).click();
  }

  uploadPicture(relativePath) {
    cy.get(this.locators.uploadPicture).selectFile(
      `cypress/fixtures/${relativePath}`,
      { force: true }
    );
  }

  fillAddress(value) {
    cy.get(this.locators.currentAddress).clear().type(value);
  }

  selectState(state) {
    cy.get(this.locators.stateContainer).click();
    cy.get(this.locators.stateInput).type(state + '{enter}');
  }

  selectCity(city) {
    cy.get(this.locators.cityContainer).click();
    cy.get(this.locators.cityInput).type(city + '{enter}');
  }

  submit() {
    cy.get(this.locators.submit).click();
  }

  assertSubmitted() {
    cy.contains(
      this.locators.modalTitle,
      'Thanks for submitting the form'
    ).should('be.visible');
  }
}
