require("dotenv").config()
const express = require('express');
const session = require('express-session');
const passport = require("passport")
const Auth0Strategy = require("passport-auth0")
const students = require("./students.json")

const app = express();
const {
    SERVER_PORT,
    SECRET,
    REACT_APP_DOMAIN,
    REACT_APP_CLIENT_ID,
    CLIENT_SECRET
} = process.env

app.use(express.json())
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Auth0Strategy({
    domain: REACT_APP_DOMAIN,
    clientID: REACT_APP_CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "/login",
    scope: "openid email profile"
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile)
    }))

passport.serializeUser((user, done) => {
    done(null, { clientID: user.id, email: user._json.email, name: user._json.name })
})
passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.get("/login", passport.authenticate("auth0",
    { successRedirect: "/students", failureRedirect: "/login", connection: "github" }
))

function authenticated(req, res, next) {
    if(req.user) {
        next()
    }
    else {
        res.status(401).send("don't know who you are")
    }
}

app.get("/students", authenticated, (req, res, next) => {
    res.status(200).send(students)
})

app.listen(SERVER_PORT || 3005, () => { console.log(`Server listening on port ${SERVER_PORT}`); });