/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const Employee = require('../employee.model');

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.log(err);
    }
  });
  describe('Reading data', () => {
    beforeEach(async () => {
      const emp = new Employee({ firstName: 'Mark', lastName: 'Dower', department: 'Clean' });
      await emp.save();

      const empTwo = new Employee({ firstName: 'Rob', lastName: 'Left', department: 'IT' });
      await empTwo.save();
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 1;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return proper document by various params with "findOne" method.', async () => {
      const emp1 = await Employee.findOne({ firstName: 'Rob' });
      const emp2 = await Employee.findOne({ lastName: 'Left' });
      const emp3 = await Employee.findOne({ department: 'IT' });
      const expectedName = 'Rob';
      const expectedLastName = 'Left';
      const expectedDep = 'IT';

      expect(emp1.firstName).to.be.equal(expectedName);
      expect(emp2.lastName).to.be.equal(expectedLastName);
      expect(emp3.department).to.be.equal(expectedDep);
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const emp = new Employee({ firstName: 'Maryl', lastName: 'Steep', department: 'QC' });
      await emp.save();
      expect(emp.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const empTwo = new Employee({ firstName: 'Rob', lastName: 'Left', department: 'IT' });
      await empTwo.save();

      const empThree = new Employee({ firstName: 'Jack', lastName: 'Daniels', department: 'QC' });
      await empThree.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Rob' }, { $set: { firstName: 'Paul' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'Paul' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const emp = await Employee.findOne({ firstName: 'Rob' });
      emp.firstName = 'Paul';
      await emp.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Paul' });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Hai!' } });
      const deps = await Employee.find();
      expect(deps[0].firstName).to.be.equal('Hai!');
      expect(deps[1].firstName).to.be.equal('Hai!');
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const empTwo = new Employee({ firstName: 'Rob', lastName: 'Left', department: 'IT' });
      await empTwo.save();

      const empThree = new Employee({ firstName: 'Jack', lastName: 'Daniels', department: 'QC' });
      await empThree.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Rob' });
      const removedEmployee = await Employee.findOne({ firstName: 'Rob' });
      expect(removedEmployee).to.be.null;
    });
    it('should properly remove one document with "remove" method', async () => {
      const emp = await Employee.findOne({ firstName: 'Rob' });
      await emp.remove();
      const removedEmp = await Employee.findOne({ firstName: 'Rob' });
      expect(removedEmp).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const Employees = await Employee.find();
      expect(Employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  after(() => {
    mongoose.models = {};
  });
});
