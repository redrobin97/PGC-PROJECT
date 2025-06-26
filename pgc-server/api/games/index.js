const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jbdhbvchukeavbewuhvhled";
const { getUserById } = require("../../db/querys/users");
const { createNewGame, addPlayer } = require("../../db/querys/games");

router.use("/twenty_one", require("./twenty_one"));
// router.use(async (req, res, next) => {
//   const prefix = "Bearer ";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     // console.log("no auth");
//     next();
//   } else if (auth.startsWith(prefix)) {
//     // console.log("authorized");
//     const token = auth.slice(prefix.length);
//     try {
//       const parsedToken = jwt.verify(token, JWT_SECRET);
//       const id = parsedToken && parsedToken.id;
//       if (id) {
//         req.user = await getUserById(id);
//         next();
//       }
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must that with ${prefix}`,
//     });
//   }
// });
// router.use("/twentyOne", require("./twentyOne"));

// api/games/join
router.post("/join", (req, res) => {
  async function joinGame() {
    try {
      const user = req.body.user;
      const game = req.body.game;
      const newPlayer = await addPlayer({ user, game });
      console.log(newPlayer);
      newPlayer
        ? res.send({ message: "Player added successfully", newPlayer })
        : res.send("error adding player");
    } catch (err) {
      throw err;
    }
  }
  joinGame();
});

// /api/games/newGame/
router.post("/newGame", (req, res) => {
  async function createGame() {
    try {
      const gameType = req.body.game_type;
      const game = await createNewGame(gameType);
      game
        ? res.send({ message: "game created successfully", game })
        : res.send({ message: "error creating game" });
      return game;
    } catch (err) {
      throw err;
    }
  }
  createGame();
});

module.exports = router;
