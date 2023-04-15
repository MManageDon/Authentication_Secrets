//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.set("view engine", "ejs");

const dataSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisournewsecrets"
dataSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const UserLogin = new mongoose.model("UserLogin", dataSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res) {

    const newUser = new UserLogin ({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save().then(function(results, err) {
        if(!err) {
            res.render("secrets")
        } else {
            console.log(err);
        }
    });

});

app.post("/login", function(req, res) {
    const userName = req.body.username;
    const Password = req.body.password;

    UserLogin.findOne({email: userName}).then(function(userFound, err) {
        if(!err) {
            if (userFound){
                if (userFound.password === Password) {
                    res.render("secrets");
                } else {
                    console.log("Password is incorrect, Please try again");
                }
            } else {
                res.render("register");
            } 
        } else {
            console.log(err);
        }
    });

});



app.listen(3000, function() {
    console.log("Server started on Port 3000!");
});