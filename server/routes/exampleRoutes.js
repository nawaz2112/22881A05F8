// server/routes/exampleRoutes.js

const express = require("express");
const { exampleHandler } = require("../controllers/exampleController");

const router = express.Router();

router.get("/", exampleHandler);

module.exports = router;
