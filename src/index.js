const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Gerar id com numeros randomicos

const app = express();
app.use(express.json());

app.listen(3333);
