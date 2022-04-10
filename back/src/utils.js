const jwt = require("jsonwebtoken");

function getAgricultorId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { agricultorId } = jwt.verify(token, process.env.JWT_SECRET);
    return agricultorId;
  }
  throw new Error("Agricultor não autenticado!");
}

module.exports = {
  getAgricultorId,
};
