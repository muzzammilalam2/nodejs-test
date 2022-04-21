const passwordValidator = require("password-validator");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
// Create and Save a new User
exports.create = (req, res) => {
  //Validate request
  if (!validateUser(req, res)) {
    return;
  }
  // Create a User
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};
exports.findOne = async (req, res) => {
  if (!validateUser(req, res)) {
    return;
  }
  const userDetail = await User.findOne({
    where: { email: req.body.email, password: req.body.password },
  });
  if (userDetail == null) {
    res.status(404).send({
      message: "User not found",
    });
  }
  res.status(200).send({
    message: "Login Successful",
    userDetail: userDetail,
  });
  return;
};

// Validate User
function validateUser(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Email or Password cant be empty",
    });
    return false;
  }
  let email = req.body.email;
  let password = req.body.password;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  let emailValidated = emailRegexp.test(email);
  var schema = new passwordValidator();
  schema
    .is()
    .min(6, "Password should contain min of 6 characters")
    .has()
    .uppercase()
    .has()
    .lowercase();
  let passwordValidated = schema.validate(password, { list: true });
  if (!emailValidated) {
    res.status(400).send({
      message: "Email is incorrect",
    });
    return false;
  }
  if (!passwordValidated || passwordValidated.length > 0) {
    res.status(400).send({
      message: "Password is incorrect",
      validation: passwordValidated,
    });
    return false;
  }
  return true;
}
