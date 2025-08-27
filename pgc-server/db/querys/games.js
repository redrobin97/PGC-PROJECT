const client = require("../client");

//create new game
async function createNewGame(game_type) {
  try {
    const {
      rows: [game],
    } = await client.query(
      `
        INSERT INTO games(game_type)
        VALUES ($1)
        RETURNING *;
      `,
      [game_type]
    );
    return game;
  } catch (err) {
    throw err;
  }
}

//get game by id
async function getGameById(id) {
  try {
    const { rows: game } = await client.query(
      `
      SELECT * FROM games WHERE id = $1`,
      [id]
    );
    return game;
  } catch (err) {
    throw err;
  }
}

//add player to game
async function addPlayer({ user, game }) {
  try {
    const {
      rows: [newPlayer],
    } = await client.query(
      `
        INSERT INTO game_players(player_id, game_id) 
        VALUES ($1, $2) 
        RETURNING *`,
      [user.id, game.id]
    );
    return newPlayer;
  } catch (err) {
    throw err;
  }
}

//assign player seats
async function assignSeat({ player, seat, game }) {
  try {
    const {
      rows: [assignedSeat],
    } = await client.query(
      `
        UPDATE game_players
        SET seat_number = $1
        WHERE player_id = $2
          AND game_id = $3
        RETURNING *`,
      [seat, player.id, game.id]
    );
    return assignedSeat;
  } catch (err) {
    throw err;
  }
}

//remove deck cards
async function removeDeckCards({ game, card }) {
  try {
    const { rows: removedCard } = await client.query(
      `
      DELETE FROM deck_cards
      WHERE game_id = $1
      AND card_id = $2
      RETURNING *
      `,
      [game.id, card.card_id]
    );
    return removedCard;
  } catch (err) {
    throw err;
  }
}

//updateDeck positions
async function updateDeckPosition({ game, card, position }) {
  try {
    const {
      rows: [deckCard],
    } = await client.query(
      `
        UPDATE deck_cards
        SET position = $1
        WHERE game_id = $2 AND card_id = $3
        RETURNING *`,
      [position, game.id, card.card_id]
    );
    return deckCard;
  } catch (err) {
    throw err;
  }
}

//assign player hand
async function assignHandCards({ game, player, card }) {
  try {
    const { rows: playerHand } = await client.query(
      `
            INSERT INTO hand_cards(game_id, player_id, card_id)
            VALUES($1, $2, $3)
            RETURNING *`,
      [game.id, player.id, card.card_id]
    );
    return playerHand;
  } catch (err) {
    throw err;
  }
}

//intialize deck
async function initDeck() {
  try {
    const { rows: deck } = await client.query(
      `
            SELECT * FROM cards
      `
    );
    return deck;
  } catch (err) {
    throw err;
  }
}

//get deck by ID
async function getDeckbyId(id) {
  try {
    const { rows: deck } = await client.query(
      `
      SELECT * FROM deck_cards
      WHERE game_id = 1;
      `
    );
    return deck;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createNewGame,
  addPlayer,
  updateDeckPosition,
  assignSeat,
  assignHandCards,
  getGameById,
  initDeck,
  getDeckbyId,
  removeDeckCards,
};
