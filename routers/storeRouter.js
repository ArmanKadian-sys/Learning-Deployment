const express = require("express");
const storeController = require("../controllers/storeController.js");
const store_router = express.Router();

store_router.get("/", storeController.getHome);
store_router.get("/homes/:homeId", storeController.getHomeDetails);
store_router.post("/favourites", storeController.addFavourites);
store_router.get("/favourites", storeController.showFavourites);

exports.store_router = store_router;
