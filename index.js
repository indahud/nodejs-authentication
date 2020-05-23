const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const authRoutes =  require('./routes/auth');
const dashBoardRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');

dotenv.config();

// Import Routes


// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to DB")
);

// Middlewares
app.use(express.json());

app.use("/api/user", authRoutes);

// protected with token
app.use("/api/dashboard", verifyToken, dashBoardRoutes);

app.listen(3000, console.log('App running'));


