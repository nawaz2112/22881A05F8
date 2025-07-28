// server/app.js

const express = require("express");
const exampleRoutes = require("./routes/exampleRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/example", exampleRoutes);

module.exports = app;
