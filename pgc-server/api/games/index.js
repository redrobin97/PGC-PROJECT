const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "jbdhbvchukeavbewuhvhled" } = process.env;
const { getUserById } = require("../../db/querys/users");
const { createNewGame } = require("../../db/querys/createNewGame");

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

// /api/games
router.get("/:game_type", (req, res) => {
  async function createGame() {
    try {
      const gameType = req.params.game_type;
      const game = await createNewGame(gameType);
      // console.log(game);
      res.send(game);
      return game;
    } catch (err) {
      throw err;
    }
  }
  createGame();
});

module.exports = router;
