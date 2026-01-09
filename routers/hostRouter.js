const express = require("express");
const hostController = require("../controllers/hostController");

const host_router = express.Router();

host_router.get("/submission", hostController.getHost);

host_router.post("/added", hostController.postHost);

host_router.get("/homes", hostController.getHomes);

host_router.post("/editHome", hostController.postEdit);

host_router.post("/edited", hostController.postEdited);

exports.host_router = host_router;
