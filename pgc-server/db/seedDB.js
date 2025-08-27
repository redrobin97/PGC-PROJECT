const client = require("./client.js");
const { createUser } = require("./querys/users.js");

//DROP any pre-existing tables
async function dropTables() {
  console.log("Dropping all tables...");
  try {
    await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
  `);
  } catch (err) {
    throw err;
  }
}

//CREATE DB tables
async function createTables() {
  //create user table
  console.log("Building user table...");
  try {
    await client.query(`
            CREATE TABLE users(
              id SERIAL PRIMARY KEY,
              username VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              role VARCHAR(50) DEFAULT 'player'
            )`);
  } catch (err) {
    throw err;
  }

  //create games table
  console.log("Building games table...");
  try {
    await client.query(`
            CREATE TABLE games(
              id SERIAL PRIMARY KEY,
              game_type VARCHAR(50) NOT NULL,
              game_complete BOOLEAN DEFAULT FALSE
            )`);
  } catch (err) {
    throw err;
  }

  //create cards table
  console.log("Building cards table...");
  try {
    await client.query(`
            CREATE TABLE cards(
              id SERIAL PRIMARY KEY,
              suit VARCHAR(10),
              value VARCHAR(10),
              name VARCHAR(50),
              image_url TEXT
            )`);
  } catch (err) {
    throw err;
  }

  //create game_players table
  console.log("Building game_players table...");
  try {
    await client.query(`
            CREATE TABLE game_players (
              player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
              game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
              is_turn BOOLEAN DEFAULT FALSE,
              seat_number INTEGER,
              score INTEGER DEFAULT 0,
              result VARCHAR(20),
              PRIMARY KEY (player_id, game_id))`);
  } catch (err) {
    throw err;
  }

  //create deck_cards table
  console.log("Building deck_cards table...");
  try {
    await client.query(`
            CREATE TABLE deck_cards (
              game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
              card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
              position INTEGER NOT NULL,
              PRIMARY KEY (game_id, card_id))`);
  } catch (err) {
    throw err;
  }

  //create hand_cards table
  console.log("Building hand_cards table...");
  try {
    await client.query(`
            CREATE TABLE hand_cards (
              game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
              player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
              card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
              PRIMARY KEY (game_id, player_id, card_id))`);
  } catch (err) {
    throw err;
  }
}

// INSERT dummy data into users table
async function createInitialUsers() {
  console.log(`Creating users seed data...`);
  try {
    const fakeUsers = [
      { username: "usr1", password: "pswrd1", role: "admin" },
      { username: "test", password: "pswrd2", role: "player" },
      { username: "usr3", password: "pswrd3", role: "player" },
    ];
    const users = await Promise.all(fakeUsers.map(createUser));
    console.log("Users created!");
  } catch (err) {
    console.log("Error creating dummy users!");
    throw err;
  }
}

// INSERT data into cards
async function createCards() {
  console.log(`Creating card seed data...`);
  try {
    await client.query(`
      INSERT INTO cards (suit, value, name, image_url)
      VALUES
        -- Hearts
        ('hearts', 'A', 'Ace of Hearts', ''),
        ('hearts', '2', 'Two of Hearts', ''),
        ('hearts', '3', 'Three of Hearts', ''),
        ('hearts', '4', 'Four of Hearts', ''),
        ('hearts', '5', 'Five of Hearts', ''),
        ('hearts', '6', 'Six of Hearts', ''),
        ('hearts', '7', 'Seven of Hearts', ''),
        ('hearts', '8', 'Eight of Hearts', ''),
        ('hearts', '9', 'Nine of Hearts', ''),
        ('hearts', '10', 'Ten of Hearts', ''),
        ('hearts', '10', 'Jack of Hearts', ''),
        ('hearts', '10', 'Queen of Hearts', ''),
        ('hearts', '10', 'King of Hearts', ''),

        -- Diamonds
        ('diamonds', 'A', 'Ace of Diamonds', ''),
        ('diamonds', '2', 'Two of Diamonds', ''),
        ('diamonds', '3', 'Three of Diamonds', ''),
        ('diamonds', '4', 'Four of Diamonds', ''),
        ('diamonds', '5', 'Five of Diamonds', ''),
        ('diamonds', '6', 'Six of Diamonds', ''),
        ('diamonds', '7', 'Seven of Diamonds', ''),
        ('diamonds', '8', 'Eight of Diamonds', ''),
        ('diamonds', '9', 'Nine of Diamonds', ''),
        ('diamonds', '10', 'Ten of Diamonds', ''),
        ('diamonds', '10', 'Jack of Diamonds', ''),
        ('diamonds', '10', 'Queen of Diamonds', ''),
        ('diamonds', '10', 'King of Diamonds', ''),

        -- Clubs
        ('clubs', 'A', 'Ace of Clubs', ''),
        ('clubs', '2', 'Two of Clubs', ''),
        ('clubs', '3', 'Three of Clubs', ''),
        ('clubs', '4', 'Four of Clubs', ''),
        ('clubs', '5', 'Five of Clubs', ''),
        ('clubs', '6', 'Six of Clubs', ''),
        ('clubs', '7', 'Seven of Clubs', ''),
        ('clubs', '8', 'Eight of Clubs', ''),
        ('clubs', '9', 'Nine of Clubs', ''),
        ('clubs', '10', 'Ten of Clubs', ''),
        ('clubs', '10', 'Jack of Clubs', ''),
        ('clubs', '10', 'Queen of Clubs', ''),
        ('clubs', '10', 'King of Clubs', ''),

        -- Spades
        ('spades', 'A', 'Ace of Spades', ''),
        ('spades', '2', 'Two of Spades', ''),
        ('spades', '3', 'Three of Spades', ''),
        ('spades', '4', 'Four of Spades', ''),
        ('spades', '5', 'Five of Spades', ''),
        ('spades', '6', 'Six of Spades', ''),
        ('spades', '7', 'Seven of Spades', ''),
        ('spades', '8', 'Eight of Spades', ''),
        ('spades', '9', 'Nine of Spades', ''),
        ('spades', '10', 'Ten of Spades', ''),
        ('spades', '10', 'Jack of Spades', ''),
        ('spades', '10', 'Queen of Spades', ''),
        ('spades', '10', 'King of Spades', '');

      `);
  } catch (err) {
    console.log("Error creating cards!");
    throw err;
  }
}

//run ALL seed functions to seed DB
async function rebuildDB() {
  try {
    client.connect();
    console.log("connected to DB client");
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createCards();
  } catch (err) {
    console.log("error during rebuild");
    throw err;
  }
}

module.exports = { rebuildDB };
