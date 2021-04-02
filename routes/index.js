var express = require("express");
var apiRouter = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.controller");

/* GET home page. */
apiRouter.get("/login",(req,res)=>{
	res.render('login');
});

apiRouter.get(
	"/auth/google",
	userController.createUser,
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
apiRouter.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		res.redirect("/login");
	}
);
module.exports = apiRouter;
