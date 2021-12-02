const express = require("express");
const mongoose = require("mongoose");

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

// Port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}!`));







// // DB config
// const db = require("./config/keys").mongoURI;

// Connect to Mongo
// mongoose.connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("Connected to MongoDB");
//     })
//     .catch(err => {
//         console.log(err);
//     });

// // Use routes
// app.use('/api/weapons', weapons);

//     const port = process.env.PORT || 5000;

//     app.listen(port, () => {
//         console.log(`server started on port ${port}!`);
//     });
