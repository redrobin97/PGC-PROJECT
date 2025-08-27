const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUser,
  getUserByUsername,
  createUser,
} = require("../db/querys/users");
const JWT_SECRET = process.env.JWT_SECRET || "jbdhbvchukeavbewuhvhled";

// /api/users
router.get("/", (req, res) => {
  res.send("hello from /api/users");
});

//POST api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return next({
        name: "MissingCredentialsError",
        message: "Username and password are required.",
        status: 400,
      });
    }

    const user = await getUser({ username, password });

    if (!user) {
      return next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect.",
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({ user, message: "Logged in successfully!", token });
  } catch (err) {
    next(err);
  }
});

//POST api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return next({
        name: "UserExistsError",
        message: "A user with that username already exists.",
        status: 409,
      });
    }

    if (!password || password.length < 8) {
      return next({
        name: "PasswordLengthError",
        message: "Password must be at least 8 characters.",
        status: 422,
      });
    }

    const user = await createUser({ username, password });

    if (!user) {
      return next({
        name: "UserCreationError",
        message: "There was an error creating your account.",
        status: 500,
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({ user, message: "Signup successful!", token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
