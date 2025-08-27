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
  console.error(`SERVER ERROR at ${req.method} ${req.originalUrl}:`, error);

  const status = error.status || 500;
  res.status(status).json({
    error: {
      name: error.name || "Error",
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
