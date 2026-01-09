//Installed Moduless
const ENV=process.env.NODE_ENV || 'development';
require("dotenv").config({
  path:`.env.${ENV}`
});
const helmet=require("helmet"); 
const compression=require("compression");
const bodyParser = require("body-parser");
const express = require("express");
const morgan=require('morgan');
const app = express();
app.use(helmet());
app.use(compression());

const { getError } = require("./controllers/errorController.js");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
//Exported Modules
const { host_router } = require("./routers/hostRouter");
const { store_router } = require("./routers/storeRouter");
const { authRouter } = require("./routers/authRouter.js");
const mongoose = require("mongoose");

const murl =
  "mongodb+srv://root:root@airbnb.hpzbku8.mongodb.net/airbnb?appName=airbnb";
app.set("view engine", "ejs");

const store = new MongoDBStore({
  uri: murl,
  collection: "sessions",
});

app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "ARMAN KADIAN",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(authRouter);

app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  } else {
    next();
  }
});
app.use("/host", host_router);

app.use(store_router);
app.use(getError);
const url =
  "mongodb+srv://root:root@airbnb.hpzbku8.mongodb.net/airbnb?appName=airbnb";

const PORT=process.env.PORT || 3000;
mongoose.connect(url).then(() => {
  app.listen(3000, () => {
    console.log("server started");
  });
});
