module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  PORT: "3307",
  DB: "node_test",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
