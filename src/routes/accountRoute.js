const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Gerar id com numeros randomicos
const { verifyIfExistsAccountCPF } = require("./middlewares/verifyAccount");
const router = new express.Router();

const customers = [];

// Creating account
router.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const cpfAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (cpfAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  const id = uuidv4();

  customers.push({
    cpf,
    name,
    id,
    statement: [],
  });

  return res.status(201).send("Created succesfully!");
});

// Get statement
router.get("/statement/", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const customerStatement = customer.statement;

  return res.json(customerStatement); // default status code = 200
});

// Making deposit
router.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description: description,
    amount: amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);
  console.log(statementOperation.amount);

  return res.status(201).send("Deposit created!");
});

router.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount: amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);
  console.log(statementOperation.amount);
  return res.status(201).send("Withdraw succesfully");
});

// Get statement by date
router.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.json(statement); // default status code = 200
});

// Update account
router.put("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(200).send(customer);
});

// Get account information
router.get("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

// Deleting account
router.delete("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  // splice
  customers.splice(customer, 1);

  return res.status(200).send(customers);
});

router.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);
  return res.status(200).json(balance);
});

module.exports = router;
