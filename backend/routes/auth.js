const router = require('express').Router()
const passport = require('passport')

router.get('/login/success', (req, res) => {
  //   req.logout();
  //   res.redirect(process.env.CLIENT_URL);
  console.log("here\n\n");
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.user
    })
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' })
  }
})

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure'
  })
})

router.get('/google', passport.authenticate('google', ['profile', 'email']))
router.get('help', (req, res) => {
  res.status(200).json({
    message: 'hi'
  })
})
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL, // Set successRedirect to false to handle success directly in the callback
    failureRedirect: '/login/failed'
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(process.env.CLIENT_URL)
})

module.exports = router
