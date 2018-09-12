require("dotenv").config()
const express = require('express');
const session = require("express-session")
const axios = require("axios")

const app = express();

const {
  SERVER_PORT,
  SESSION_SECRET,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_API_CLIENT_ID,
  AUTH0_API_CLIENT_SECRET
} = process.env

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))


app.get('/callback', (req, res) => {
  exchangeCodeForAccessToken()
  .then(exchangeAccessTokenForUserInfo)
  .then(fetchAuth0AcessToken)
  .then(fetchGitHubAccessToken)
  .then(setGitTokentoSession)
  .catch(err => {
    console.log(err)
    res.status(500).send("An error occured on the server. Check the terminal.")
  })

  function exchangeCodeForAccessToken() {
    const {code} = req.query

    const payload = {
      client_id: REACT_APP_AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: `http://${req.headers.host}/callback`
    }

    return axios.post(`https://${REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
  }
})

app.get('/api/user-data', (req, res) => {
  res.status(200).json(req.session.user)
})

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
})

app.listen(SERVER_PORT || 3005, () => { console.log(`Server listening on port ${SERVER_PORT}`); });
