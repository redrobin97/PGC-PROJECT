const client = require("../client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//create user in DB
async function createUser({ username, password, role }) {
  const hashedPwd = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password, role) VALUES($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id, username, role`,
      [username, hashedPwd, role]
    );
    return user;
  } catch (err) {
    throw err;
  }
}

//get a user and check password
async function getUser({ username, password }) {
  if (!username || !password) return;
  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
}

//get user by username
async function getUserByUsername(userName) {
  try {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE username = $1`,
      [userName]
    );

    //if no user => return null
    if (!rows || !rows.length) return null;

    const [user] = rows;
    //if user found => delete password from returned object
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [userId]
    );
    if (!user) return null;
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = { createUser, getUserByUsername, getUser, getUserById };
