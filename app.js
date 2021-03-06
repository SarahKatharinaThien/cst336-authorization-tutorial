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
app.get("/", function (req, res) {
    res.render("index");
});

app.post("/", async function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let result = await checkUsername(username);
    console.dir(result);
    let hashedPwd = "";

    if (result.length > 0) {
        hashedPwd = result[0].password;
    }

    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);

    if (passwordMatch) {
        req.session.authenticated = true;
        res.render("welcome");
    } else {
        res.render("index", {"loginError": true});
    }
});

app.get("/myAccount", isAuthenticated, function (req, res) {
    res.render("account");
});

app.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

//functions

function createDBConnection() {
    var conn = mysql.createConnection({
        host: "jlg7sfncbhyvga14.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "cyfsnpun1k6t7hl0",
        password: "wn5f0xlpg9h74xzm",
        database: "zlnn4a9v1cikplkx"
    });
    return conn;
}

/**
 * Checks whether the username exists in database.
 * If found, returns corresponding record.
 * @param {string} username
 * @return {array of objects}
 */
function checkUsername(username) {
    let sql = "SELECT * FROM user WHERE username = ?";
    return new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [username], function (err, rows, fields) {
                if (err) throw err;
                console.log("Rows found: " + rows.length);
                resolve(rows);
            }); //query
        }); //connect
    }); //promise
}

/**
 * Checks the bcrypt value of the password submitted.
 * @param {string} password
 * @return {boolean} true if password submitted is equal to bcrypt-hashed value, false otherwise.
 */
function checkPassword(password, hashedValue) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hashedValue, function (err, result) {
            console.log("Result: " + result);
            resolve(result);
        });
    });
}

function isAuthenticated(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect("/");
    } else {
        next()
    }
}

//listener
app.listen(8080, "0.0.0.0", function () {
    console.log("Running Express Server...");
});