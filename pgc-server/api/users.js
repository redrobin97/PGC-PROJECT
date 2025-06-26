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
      next({
        name: "MissingCredentialsError",
        message: "Username and Password required",
      });
    }

    const user = await getUser({ username, password });

    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: `1w` }
      );
      res.send({ user, message: "Logged in successfully!", token });
    }

    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
});

//POST api/users/register

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      res.status(401);
      next({
        name: "UserExistsError",
        message: "A user by that username already exists.",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "PasswordLengthError",
        message: "Password must be atleast than 8 characters.",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });
      if (!user) {
        next({
          name: "UserCreationError",
          message:
            "There was an error creating your account. Please try again.",
        });
      } else {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: "1w" }
        );
        res.send({ user, messsage: "Signup success!", token });
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
