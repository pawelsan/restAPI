const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const homeRoute = require("./api/routes/home");
const moviesRoutes = require("./api/routes/movies");
const commentsRoutes = require("./api/routes/comments");
const userRoutes = require("./api/routes/users");

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// CSS
app.use(express.static("public"));


// Securing database password
require('dotenv').config();
const password = process.env.PASSWORD

// DB Config
mongoose.connect("mongodb+srv://pawelsan:" + password + "@node-restapi-movies-v7xnu.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(Error, err.message);
    });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS solution
app.use((res, req, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})
// forwarding requests to specified routes
app.use("/", homeRoute);
app.use("/movies", moviesRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app