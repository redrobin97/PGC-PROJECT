const client = require("./client");
const { rebuildDB } = require("./seedDB.js");

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
