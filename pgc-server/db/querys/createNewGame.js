require("dotenv").config();
const client = require("../client");

async function createNewGame(game_type) {
  try {
    const game = await client.query(
      `
        INSERT INTO games(game_type)
        VALUES ($1)
        RETURNING *;
      `,
      [game_type]
    );
    return game.rows[0];
    ``;
  } catch (err) {
    console.log(err);
  }
}

// Properly run it:

module.exports = { createNewGame };
