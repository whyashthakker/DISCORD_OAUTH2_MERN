const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.log(err);
        done(err, null);
    }

});


passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try{
   const user = await User.findOne({ discordId: profile.id });
    if (user) {
        done(null, user);
    }
    else {
        const newUser = await User.create({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            guilds: profile.guilds
        });
        const savedUser = await newUser.save();
        done(null, savedUser);
    }
    } catch (err) {
        console.log(err);
        done(err, null);
    }
}
));