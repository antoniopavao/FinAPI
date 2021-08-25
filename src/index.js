const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Gerar id com numeros randomicos

const app = express();
app.use(express.json());

const customers = [];

/* 
cpf - string 
name - string
id - uuid
statement - []

*/

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

app.get("/statement/", (req, res) => {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) return res.status(400).json({ error: "Customer not found" });

  const customerStatement = customer.statement;

  return res.json(customerStatement); // default status code = 200
});

app.listen(3333);
