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
async function assignSeat({ user, seatNumber }) {
  try {
    const {
      rows: [assignedSeat],
    } = await client.query(
      `
        UPDATE game_players
        SET seat_number = $1
        WHERE player_id = $2
        RETURNING *`,
      [seatNumber, user.id]
    );
    return assignedSeat;
  } catch (err) {
    throw err;
  }
}

//assign deck cards
async function assignDeckCard({ game, card, position }) {
  try {
    const {
      rows: [deckCard],
    } = await client.query(
      `
        INSERT INTO deck_cards(game_id, card_id, position)
        VALUES($1, $2, $3)
        RETURNING *`,
      [game.id, card.id, position]
    );
    return deckCard;
  } catch (err) {
    throw err;
  }
}

//assign player hand
async function assignHand({ game, user }) {
  try {
    const { rows: playerHand } = await client.query(
      `
            INSERT INTO hand_cards(game_id, player_id)
            VALUES($1, $2)
            RETURNING *`,
      [game.id, user.id]
    );
    return playerHand;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createNewGame,
  addPlayer,
  assignDeckCard,
  assignSeat,
  assignHand,
};
