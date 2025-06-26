require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const client = require("./db/client");

const app = express();
const port = process.env.PORT || 3000;

client
  .connect()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error", err));

app.use(cors());
app.use(bodyParser.json());

app.use("/api", require("./api"));
app.use("/api/games", require("./api/games"));

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).send({ error: error.message, name: error.name });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
