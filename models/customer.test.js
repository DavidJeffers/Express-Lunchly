"use strict";

const db = require("../db");
const Customer = require("./customer");

let testCustomerId;
let testCustomerId2;
let testCustomer3;
beforeAll(async function () {
  const result = await db.query(`INSERT INTO customers
        (first_name, last_name, phone, notes) 
        VALUES ('testUser1', 'testLast1', 123, 'testNotes1'),
        ('testUser2', 'testLast2', 1234, 'testNotes2')
        RETURNING id
        `);
  testCustomerId = result.rows[0].id;
  testCustomer3 = {
    firstName: "first",
    lastName: "last",
    phone: "1234",
    notes: "testNotes",
  };
  testCustomerId2 = result.rows[1].id;
});
afterAll(async function () {
  await db.query(`DELETE FROM customers`);
});

describe("getting all customers", function () {
  test("get all customers", async function () {
    const result = await Customer.all();
    expect(result).toEqual([
      {
        id: testCustomerId,
        firstName: "testUser1",
        lastName: "testLast1",
        phone: "123",
        notes: "testNotes1",
      },
      {
        id: testCustomerId2,
        firstName: "testUser2",
        lastName: "testLast2",
        phone: "1234",
        notes: "testNotes2",
      },
    ]);
    expect(result[0]).toBeInstanceOf(Customer);
  });
});

describe("get customer by id", function () {
  test("get single valid customer", async function () {
    const customer = await Customer.get(testCustomerId);
    expect(customer).toEqual({
      id: testCustomerId,
      firstName: "testUser1",
      lastName: "testLast1",
      phone: "123",
      notes: "testNotes1",
    });
  });
  test("get single invalid customer", async function () {
    try {
      const customer = await Customer.get(5555);
    } catch (err) {
      expect(err.message).toEqual("No such customer: 5555");
    }
  });
});

describe("update or add specific customer", function () {
  test("update customer", async function () {
    const customer = await Customer.get(testCustomerId);
    customer.firstName = "newFirst";
    await customer.save();
    const updatedCustomer = await Customer.get(testCustomerId);
    expect(updatedCustomer).toEqual({
      id: testCustomerId,
      firstName: "newFirst",
      lastName: "testLast1",
      phone: "123",
      notes: "testNotes1",
    });
  });

  test("add customer", async function () {
    let { firstName, lastName, phone, notes } = testCustomer3;
    let customer = new Customer({ firstName, lastName, phone, notes });

    await customer.save();
    const result = await db.query(
      `SELECT first_name AS "firstName" From customers WHERE first_name = 'first'`
    );
    const firstName1 = result.rows[0].firstName;
    expect(firstName1).toEqual("first");
  });
});
