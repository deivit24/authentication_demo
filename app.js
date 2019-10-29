const express				= require("express"),
	  mongoose  			= require("mongoose"),
	  passport 				= require("passport"),
	  bodyParser			= require("body-parser"),
	  localStrategy			= require("passport-local"),
	  passportLocalMongoose	= require("passport-local-mongoose"),
	  app					= express(),
	  User					= require("./models/user"),
	  port 					= 3000;

mongoose.connect('mongodb://localhost:27017/auth_demo', {useNewUrlParser: true});

app.use(require("express-session")({
	secret: "cats > dogs",
	resave: false,
	saveUninitialized: false
}))


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===============================================
//================== ROUTES =====================
//================================================



app.get('/', (req, res) => {
	res.render("home");
})

app.get('/secret', isLogedIn, (req, res) => {
	res.render("secret");
})


// AUTH ROUTES
app.get('/register', (req, res) => {
	res.render("register");
})

// HANDLE USER SIGN UP
app.post('/register', (req, res) => {
	let user = req.body.username;
	let pass = req.body.password;
	User.register(new User({username: user}), pass, (err, newUser) => {
		if(err){
			console.log(err);
			return res.render('register');
		} else {
			passport.authenticate("local")(req,res, () => {
				res.redirect("/secret")
			});
		}
	});
});

// LOGIN ROUTES
app.get('/login', (req, res) => {
	res.render('login');
})


app.post('/login',passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), (req, res) => {
	
});

// LOGOUT

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect("/");
});

function isLogedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
app.listen(port, () => {
	console.log("SERVER STARTED");
})