//utility functions for all games

const {
  assignDeckCard,
  assignHand,
  assignSeat,
} = require("../../db/querys/games");

//assign game seat
async function seatAssignment({ user, seatNumber }) {
  try {
    const seat = await assignSeat({ user, seatNumber });
  } catch (err) {
    throw err;
  }
}

//assign hand
async function handAssignment({ game, user }) {
  try {
    const seat = await assignHand({ game, user });
  } catch (err) {
    throw err;
  }
}

//assign deck cards
async function deckAssignment({ game, card, position }) {
  try {
    const seat = await assignDeckCard({ game, card, position });
  } catch (err) {
    throw err;
  }
}
