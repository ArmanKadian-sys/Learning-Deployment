const path = require("path");
const rootDir = require("../utils/path.js");
const Home = require("../models/Home.js");

exports.getHost = (req, res) => {
  const value = false;
  res.render("home_edit", {
    home: "None",
    edit: value,
    isLoggedIn: req.isLoggedIn,
  });
};

exports.postHost = (req, res) => {
  const homeId = Math.random();
  const house = new Home({
    houseName: req.body.home,
    housePrice: req.body.price,
    homeId,
  });
  house.save().then(() => {
    res.sendFile(path.join(rootDir, "views", "home_added.html"));
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((homes) => {
    res.render("hostHomes", { total: homes, isLoggedIn: req.isLoggedIn });
  });
};

exports.postEdit = (req, res, next) => {
  Home.find({ homeId: parseFloat(req.body.fav) })
    .then(([home]) => {
      const value = true;
      res.render("home_edit", {
        home: home,
        edit: value,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log("this is the error", error);
    });
};

exports.postEdited = (req, res, next) => {
  console.log(req.body);
  const id = parseFloat(req.body.id);
  console.log("this is id", id);
  Home.findOneAndUpdate(
    { homeId: id },
    {
      houseName: req.body.home,
      housePrice: req.body.price,
      homeId: id,
    }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log("this is the error", error);
    });
};
