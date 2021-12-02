const express = require("express");
const mongoose = require("mongoose");

// Requiring the factories file
const factories = require("./routes/api/factories")

// Initializing Express
const app = express();

// Bodyparser within Express
app.use(express.json());

// Database
const db = require("./config/keys").mongoURI;

// Connecting to Database
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

// Use routes
// Anything going to /api/factories will refer to the factories file
app.use("/api/factories", factories)

// Port
const port = process.env.PORT || 5000;

// Starting the server
app.listen(port, () => console.log(`Server started on port ${port}!`));