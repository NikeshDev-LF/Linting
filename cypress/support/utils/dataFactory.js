import { faker } from '@faker-js/faker';

export class DataFactory {
  static generatePracticeFormData() {
    const genders = ['Male', 'Female', 'Other'];
    const hobbies = ['Sports', 'Reading', 'Music'];
    const states = ['NCR', 'Uttar Pradesh', 'Haryana', 'Rajasthan'];
    const citiesByState = {
      NCR: ['Delhi', 'Gurgaon', 'Noida'],
      'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
      Haryana: ['Karnal', 'Panipat'],
      Rajasthan: ['Jaipur', 'Jaiselmer'],
    };

    const state = faker.helpers.arrayElement(states);
    const city = faker.helpers.arrayElement(citiesByState[state]);

    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: faker.helpers.arrayElement(genders),
      mobile: faker.string.numeric({ length: 10 }),
      birthDate: faker.date
        .birthdate({ min: 18, max: 60, mode: 'age' })
        .toISOString()
        .slice(0, 10),
      subject: faker.helpers.arrayElement([
        'Maths',
        'Physics',
        'Chemistry',
        'English',
        'Computer Science',
      ]),
      hobby: faker.helpers.arrayElement(hobbies),
      address: faker.location.streetAddress(),
      state,
      city,
    };
  }

  static writePracticeFormFixture(
    relativeFixturePath = 'generated/formData.json'
  ) {
    const data = DataFactory.generatePracticeFormData();
    const normalizedPath = relativeFixturePath.endsWith('.json')
      ? relativeFixturePath
      : `${relativeFixturePath}.json`;
    return cy
      .writeFile(`cypress/fixtures/${normalizedPath}`, data, { log: true })
      .then(() => data);
  }
}
