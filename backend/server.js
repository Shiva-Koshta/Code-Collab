require("dotenv").config();
const mongoose = require("mongoose")
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy =  require("./passport");
const { Server } = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const io = new Server(server);


io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
});


// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
// app.use(cors({ origin: "*" }));

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);


// connect to database
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
    server.listen(port, () => console.log(`Listenting on port ${port}...`));
  })
  .catch((error) => {
    console.log(error)
  })