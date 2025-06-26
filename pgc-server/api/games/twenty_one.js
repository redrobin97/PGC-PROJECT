const express = require("express");
const router = express.Router();
const { requireUser } = require("../utils");

// /api/games/twenty_one/new
// router.post(`/new`, requireUser, (req, res) => {});

// /api/games/twenty_one/gameId
router.get("/:gameId", (req, res) => {
  res.send(req.params.gameId);
});

module.exports = router;
