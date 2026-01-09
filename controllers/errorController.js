const path = require("path");
const rootDir = require("../utils/path.js");

exports.getError = (req, res) => {
  res.status(404);
  res.sendFile(path.join(rootDir, "views", "home.html"));
};
