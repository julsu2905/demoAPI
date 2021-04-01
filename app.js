var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
const apiRouter = require("./routes/index");
var app = express();
const session = require("express-session");
const passport = require("passport");

app.enable("trust proxy");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		secret: "keyboard cat",
		keys: "sid",
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
	})
);
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", {
		pageTitle: "error",
	});
});

module.exports = app;
