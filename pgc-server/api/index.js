const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/games", require("./games"));

// /api
router.get("/", (req, res) => {
  res.send("hi from /api");
});

module.exports = router;
