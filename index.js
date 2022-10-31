const express = require("express");
const app = express();
const port = 8000;
const layouts = require("express-ejs-layouts");
const sass = require("node-sass-middleware");
const path = require("path")
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const env = require("./config/enviroment");

// initialization section
const db = require("./config/mongoose");
const passport = require("passport");
const passportJwt = require("./config/passport_jwt_strategy");

// sass converter
app.use(sass({
    src: path.join(__dirname, "/assets/scss"),
    dest: path.join(__dirname, "/assets/css"),
    debug: true,
    outputStyle: "expanded",
    prefix: "/css"
}))

// serving static files
app.use(express.static("./assets"));

// setting view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setting partials and layouts
app.use(layouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// extracting body or json from url
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// setting session
app.use(session({
    name: "Habit_Tracker",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    rolling: false,
    cookie: {
        maxAge: 300000
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: true
        },
        (err) => {
            console.log(err);
        }
    )
}))

// setting passport authentication
app.use(passport.initialize());
app.use(passport.session());

// routing
app.use(require("./routers/index"));


// app start
app.listen(port, (err) => {
    if (err) {
        return console.log("Unable to start server :", err);
    }
    console.log("Server is listening on port", port);
})