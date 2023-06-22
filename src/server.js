const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const db = require('./database/database');
const path = require('path');
const MongoStore = require('connect-mongo');

db.then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

require('./strategies/discordStrategy');

app.use(session({
    secret: 'some very secret key',
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 24 // 1 day
    },
    saveUninitialized: false,
    name: 'discord.oauth2',
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });  

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
