/// <reference types="cypress" />

import { PracticeFormPage } from '../pages/practiceFormPage';
import { DataFactory } from '../support/utils/dataFactory';

describe('DemoQA Practice Form - submission', () => {
  const page = new PracticeFormPage();
  before(function () {
    // generate and store dynamic data locally for this spec
    DataFactory.writePracticeFormFixture('generated/formData');
    cy.fixture('generated/formData.json').then(data => {
      this.data = data;
    });
  });

  beforeEach(() => {
    cy.visit('/automation-practice-form');
  });

  it('fills and submits the form', function () {
    page.fillFirstName(this.data.firstName);
    page.fillLastName(this.data.lastName);
    page.fillEmail(this.data.email);
    page.selectGender(this.data.gender);
    page.fillMobile(this.data.mobile);
    page.setDateOfBirth(this.data.birthDate);
    page.addSubject(this.data.subject);
    page.selectHobby(this.data.hobby);
    // page.uploadPicture('images/sample.png');
    page.fillAddress(this.data.address);
    page.selectState(this.data.state);
    page.selectCity(this.data.city);
    page.submit();
    page.assertSubmitted();
  });
});
