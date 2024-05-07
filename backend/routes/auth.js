const router = require('express').Router()
const passport = require('passport')

 /*
  Handles the GET request for '/login/success' endpoint after successful login.
  Inputs:
    req (object): The request object.
    res (object): The response object.
  Outputs:
    JSON: Response indicating successful login with user information if authenticated, or error if not authorized.
  Implementation:
    - Checks if user is authenticated.
    - If authenticated, sends a JSON response with status 200 and user information.
    - If not authenticated, sends a JSON response with status 403 and error message.
  */
router.get('/login/success', (req, res) => {
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
/*
  Handles the GET request for '/login/failed' endpoint after failed login attempt.
  Inputs:
    req (object): The request object.
    res (object): The response object.
  Outputs:
    JSON: Response indicating failed login attempt with error message.
  Implementation:
    Sends a JSON response with status 401 and error message indicating login failure.
  */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure'
  })
})
  /*
  Handles the GET request for '/help' endpoint.
  Inputs:
    req (object): The request object.
    res (object): The response object.
  Outputs:
    JSON: Response with status 200 and a message.
  Implementation:
    Sends a JSON response with status 200 and a simple greeting message.
  */

router.get('/google', passport.authenticate('google', ['profile', 'email']))
  /*
  Handles the GET request for '/help' endpoint.

  Inputs:
    req (object): The request object.
    res (object): The response object.

  Outputs:
    JSON: Response with status 200 and a message.

  Implementation:
    Sends a JSON response with status 200 and a simple greeting message.
  */

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
 /*
  Handles the GET request for '/logout' endpoint to log out the user.
  Inputs:
    req (object): The request object.
    res (object): The response object.
  Outputs:
    Redirect: Redirects to the client URL after logout.
  Implementation:
    - Logs out the user by calling req.logout().
    - Redirects the user to the client URL after logout.
  */

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(process.env.CLIENT_URL)
})

module.exports = router
