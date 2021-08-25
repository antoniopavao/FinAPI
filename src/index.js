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

app.listen(3333);
