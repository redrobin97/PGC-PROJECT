const express = require("express");
const router = express.Router();
const { requireUser } = require("../utils");
const { shuffle, drawFromDeck } = require("./game_utils");
const { getGameById, assignSeat, initDeck } = require("../../db/querys/games");

//seat assignment
router.post("/:gameId/seat", async (req, res, next) => {
  try {
    const player = req.user;
    const seat = req.body.seat;
    const game = req.body.game;

    const assignedSeat = await assignSeat({ player, seat, game });
    if (assignedSeat) {
      return res.send({ message: "Seat assigned to player", assignedSeat });
    } else {
      return res.send({ message: "No seat assigned to player" });
    }
  } catch (err) {
    next({ name: `seatAssignmentError`, message: err.message, status: 500 });
  }
});

//hand assignment
router.put("/:gameId/hand", async (req, res, next) => {
  try {
    const player = req.user;
    const game = req.body.game;

    const hand = await drawFromDeck({ game, player, numberToDraw: 2 });
    if (hand) {
      return res.send({ message: "Hand assigned to player", hand });
    } else {
      return res.send({ message: "No hand assigned to player" });
    }
  } catch (err) {
    next({ name: `handAssignmentError`, message: err.message, status: 500 });
  }
});

// /api/games/twenty_one/gameId/initialize_deck
router.post("/:gameId/initialize_deck", async (req, res, next) => {
  const game = req.body.game;
  let deck = [];
  try {
    deck = await initDeck();
  } catch (err) {
    return next({
      name: `deckCreationError`,
      message: err.message,
      status: 500,
    });
  }
  try {
    deck = shuffle(deck);
    for (let i = 0; i < deck.length; i++) {
      await assignDeckCard({ game, card: deck[i], position: i });
    }
    return res.send({ message: "Deck intialized", deck });
  } catch (err) {
    return next({
      name: `deckCreationError`,
      message: err.message,
      status: 500,
    });
  }
});

// /api/games/twenty_one/gameId
router.get("/:gameId", async (req, res, next) => {
  try {
    const game = await getGameById(req.params.gameId);
    return res.send(game);
  } catch (err) {
    next({ name: `getGameByIdError`, message: err.message, status: 500 });
  }
});

module.exports = router;
