const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Gerar id com numeros randomicos

const app = express();
app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) return res.status(400).json({ error: "Customer not found" });

  req.customer = customer;

  return next();
}

// Functions
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

// Creating account
app.post("/account", (req, res) => {
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
app.get("/statement/", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const customerStatement = customer.statement;

  return res.json(customerStatement); // default status code = 200
});

// Making deposit
app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description: description,
    amount: "R$ " + amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);
  console.log(statementOperation.amount);

  return res.status(201).send("Deposit created!");
});

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount: "R$ " + amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);
  console.log(statementOperation.amount);
  return res.status(201).send("Withdraw succesfully");
});

app.listen(3333);
