const client = require("../client");

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
    console.log(err);
  }
}

async function addPlayer({ user, game }) {
  try {
    const {
      rows: [newPlayer],
    } = await client.query(
      `
        INSERT INTO game_players(player_id, game_id) VALUES ($1, $2) RETURNING *`,
      [user.id, game.id]
    );
    return newPlayer;
  } catch (err) {
    throw err;
  }
}

// Properly run it:

module.exports = { createNewGame, addPlayer };
