/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const Department = require('../department.model.js');

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});
    dep.validate((err) => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for (const name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" is too short or too long', () => {
    const cases = ['Abc', 'abcd', 'Lorem Ipsum, Lorem Ip'];
    for (const name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should not throw an error if "name" is okay', () => {
    const cases = ['Management', 'Human Resources'];
    for (const name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
