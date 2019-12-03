const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

app.set('view engine', 'ejs');

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));

//routes
app.get("/", function(req, res) {
   res.render("index");
});

app.post("/", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log("username: " + username);
    console.log("password: " + password);
    res.send("This is the root route using POST!");
});

//listener
app.listen(8080, "0.0.0.0", function() {
    console.log("Running Express Server...");
});