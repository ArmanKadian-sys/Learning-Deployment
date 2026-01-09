const { check, validationResult } = require("express-validator");
const User = require("../models/User.js");
const bycrypt = require("bcryptjs");
const session = require("express-session");
const sendGrid=require("@sendgrid/mail");
const gridKey=process.env.GRID_KEY; //'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';

sendGrid.setApiKey(gridKey);

exports.getLogin = (req, res, next) => {
  console.log("get login");
  console.log(req.session.isLoggedIn);
  if (req.session.isLoggedIn) {
    res.redirect("/");
  } else {
    res.render("Login",{error:""});
  }
};


exports.postLogin = async (req, res, next) => {
  
  try{
  const password=req.body.password;
  const email= req.body.email;
  const user= await User.findOne({email});

  if(!user){
    return res.render('Login', {
      error:"email is incorrect"
    }) 
  }

  const isMatch = await bycrypt.compare(password, user.password);


  if(!isMatch){
    return res.render('Login', {
      error:"password is incorrect"
    })
  }

  const myuser={
    name: user.name, 
    email: user.email,
    password: user.password,
    type: user.type,
  }

  req.session.isLoggedIn=true; 
  req.session.user=myuser;
  console.log("post login entered");
  console.log(req.session);
  await req.session.save(()=>{
    res.redirect("/");
  });
  

  


  }
  catch(errors){
    res.render("Login",{error:"error while loging you in"})
  }


};




exports.postLogout = async(req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  res.render("SignUp", {
    errors: [],
    old: [],
  });
};


exports.postSignedUp = [
  //name check

  check("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name cannot be less than 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only have english alphabets"),

  //email check

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  //Password check

  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("The length of password must be atleast 8"),

  // type check

  check("type")
    .trim()
    .notEmpty()
    .withMessage("Please select atleast one type")
    .isIn(["guest", "host"])
    .withMessage("User type invalid"),

  //Main middleware

   (req, res, next) => {
    console.log("sign up ran");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("SignUp", {
        errors: errors.array().map((err) => err.msg),
        old: req.body,
      });
    }

    

    bycrypt.hash(req.body.password, 12).then(
      hashed=>{
      const user = User({
      name: req.body.name,
      password: hashed,
      email: req.body.email,
      type: req.body.type,
      });

      user
      .save()
      .then(() => {
        console.log("user details saved in DB");
        const msg={
          to: req.body.email,
          from: process.env.FROM_EMAIL, //"akadian087@gmail.com"
          subject: "Welcome to homes",
          html: `<h1>Welcome ${req.body.name} to Homes</h1>`,
        };
        sendGrid.send(msg).then(()=>{res.redirect("/login");});
        
      })
      .catch((error) => {
        return res.status(422).render("SignUp", {
          errors: [error],
          old: req.body,
        });
      });



      }
    );

    
  },
];



exports.getForgot=(req, res, next)=>{
  res.render("forgot", {error: []});
}


exports.postForgot=async(req, res, next)=>{
  const {email}=req.body;
  const user= await User.findOne({email:email});

  if(!user){
    return res.render("forgot", {error:"Email id entered is not found"});
  }

  const otp=Math.random()*10000;
  user.otp=otp;
  user.otpExpire=Date.now()/60000;

  await user.save();

   const msg={
          to: email,
          from: process.env.FROM_EMAIL, //"akadian087@gmail.com"
          subject: "Your OTP",
          html: `<h1>Your OTP is ${otp} to Homes</h1>`,
    };
  
  
  await sendGrid.send(msg);

  res.render("getotp", {email:email, error:""});
}

exports.postOtp=async(req , res, next)=>{
  console.log(req.body);
  const {otp ,email}=req.body;
  const user=await User.findOne({email:email});
  console.log(user);
  console.log(otp);
  console.log(user.otp);
  if(otp!=user.otp){
    return res.render("getotp", {email:email, error:"Entered OTP is invalid"});
  }

  if((Date.now()/60000)>user.otpExpire){
    return res.render("otpExpire");
  }

  res.render("getNewPassword", {email:email, errors:""});
 }



exports.postPassword=[
  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("The lenght of password must be atleast 8"),
  async(req, res, next)=>{
    
    const errors = validationResult(req);
    const{email}=req.body;

    if (!errors.isEmpty()) {
      return res.status(422).render("getNewPassword", {
        errors: errors.array().map((err) => err.msg),
        email
      });
    }

    
    const user=await User.findOne({email});

    const hashed= await bycrypt.hash(req.body.password, 12);

    user.password=hashed;

    await user.save();

    res.redirect("/login");


     
  }
]