// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) return res.status(400).json({ error: "Customer not found" });

  req.customer = customer;

  return next();
}

module.exports = verifyIfExistsAccountCPF;
