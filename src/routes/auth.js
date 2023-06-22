const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/forbidden',
    successRedirect: 'http://localhost:3000/dashboard'
}));

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

router.get('/user', (req, res) => {
    if(req.user){
        res.json({ user: req.user });  // Send user data when logged in
    } else {
        res.json({ user: null });  // Send null if user is not logged in
    }
});

module.exports = router;
