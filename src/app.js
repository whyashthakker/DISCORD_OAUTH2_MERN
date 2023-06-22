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


function isAuthorized (req, res, next) {
    if (req.user) {
        console.log('User is logged in.');
        res.redirect('/dashboard');

    } else {
        console.log('User is not logged in.');
        next();
    }
}

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


// Middleware
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', isAuthorized, (req, res) => {
    res.render('home', {
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    }
);