const { total } = require("./hostController");
const Home = require("../models/Home");
const User = require("../models/User");

exports.getHome = (req, res, next) => {
  console.log("home came");
  console.log(req.session);
  Home.find().then((homes) => {
    res.render("home", { total: homes, isLoggedIn: req.session.isLoggedIn });
  });
};

exports.getHomeDetails = (req, res, next) => {
  Home.find({ homeId: parseFloat(req.params.homeId) })
    .then(([home]) => {
      const value = true;
      res.render("homeDetails", {
        item: home,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log("this is the error", error);
    });
};

exports.addFavourites = async(req, res, next) => {
  const favid = parseFloat(req.body.fav);
  const user= await User.findOne({email:req.session.user.email});
  let favs;
  if(!user.fav){
     favs=[];
  }
  else{
    favs=user.fav;
  }
  favs.push(favid);
  await User.findOne({email:req.session.user.email}).updateOne({fav:favs});
  res.redirect("/favourites");

  

  
};

exports.showFavourites = async (req, res, next) => {
  console.log("entered shpw favs");
  const {email}=req.session.user;
  console.log("1");
  const user=await User.findOne({email:email});
  console.log("2");
  const favs=user.fav;
  console.log("3");
  const homes=await Home.find();
  console.log("this is homes", homes);
  console.log("4");
  const favourites=favs.map((id)=>{
    return homes.find((home)=>{return home.homeId==id});
  })
  console.log("this is favs", favourites);
  res.render("favourites", {item:favourites});
};
