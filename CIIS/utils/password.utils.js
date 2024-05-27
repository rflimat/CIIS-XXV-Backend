const bcrypt = require("bcrypt");
const saltRounds=10;
const encrypt = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const compare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { encrypt, compare };
