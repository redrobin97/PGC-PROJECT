const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jbdhbvchukeavbewuhvhled";
const { getUserById } = require("../../db/querys/users");
const { createNewGame, addPlayer } = require("../../db/querys/games");
const { requireUser } = require("../utils");

router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    // console.log("authorized");
    const token = auth.slice(prefix.length);
    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (err) {
      next(err);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must that with ${prefix}`,
    });
  }
});
router.use("/twenty_one", require("./twenty_one"));

// api/games/join
router.post("/join", requireUser, async (req, res, next) => {
  try {
    const user = req.user;
    const game = req.body.game;
    const newPlayer = await addPlayer({ user, game });

    if (newPlayer) {
      return res.send({ message: "Player added successfully", newPlayer });
    } else {
      return res.status(400).send("error adding player");
    }
  } catch (err) {
    next({
      name: "JoinGameError",
      message: err.message,
      status: 500,
    });
  }
});

// /api/games/newGame/
router.post("/newGame", async (req, res, next) => {
  const user = req.user;
  let game = {};
  //start new game
  try {
    const gameType = req.body.game_type;
    game = await createNewGame(gameType);
    if (!game) {
      return res.status(400).send({ message: "error creating game" });
    }
  } catch (err) {
    next({
      name: `NewGameError`,
      message: err.message,
      status: 500,
    });
  }
  //add player to game
  try {
    const newPlayer = await addPlayer({ user, game });

    if (newPlayer) {
      return res.send({
        message: "Player initiated a new game",
        game,
        newPlayer,
      });
    } else {
      return res.status(400).send("error adding player");
    }
  } catch (err) {
    next({
      name: "JoinGameError",
      message: err.message,
      status: 500,
    });
  }
});

module.exports = router;
