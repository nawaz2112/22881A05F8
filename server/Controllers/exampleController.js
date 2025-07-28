// server/controllers/exampleController.js

const { Log } = require("../utils/logService");

const exampleHandler = async (req, res) => {
  try {
    await Log("backend", "info", "controller", "Example API hit successfully");
    res.status(200).json({ message: "Hello from the example controller!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { exampleHandler };
