const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/loggedin", authController.postLogin);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signedup", authController.postSignedUp);
authRouter.get("/forgot", authController.getForgot);
authRouter.post("/forgot", authController.postForgot);
authRouter.post("/postOtp", authController.postOtp);
authRouter.post("/postNewPassword", authController.postPassword);

exports.authRouter = authRouter;
