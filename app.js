const express = require('express')
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express()

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)

// http://localhost:3000/auth/google/callback?
// code=4%2F0AWgavdc4cVeojcrYNnZBHlQ6r40T3iV-83gBetqpxwiIbEFEbXLQ5MBP21vFBGnPgGtcww
// &scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid
// &authuser=0&prompt=consent