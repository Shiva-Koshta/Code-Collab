const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')

// router.use(
//   cors({
//     origin: `${process.env.CLIENT_URL}`,
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true
//   })
// )

const corsOptions = {
  origin: [`${process.env.CLIENT_URL}`, 'http://code-collab-q5qj.onrender.com/auth/login/success', 'http://code-collab-q5qj.onrender.com', 'https://code-collab-q5qj.onrender.com'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
};

router.use(cors(corsOptions));

router.use(bodyParser.json())

router.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 100
  })
)

router.use(passport.initialize())
router.use(passport.session())

module.exports = router
