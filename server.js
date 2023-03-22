/*
 * This will create a server using express which will
 * be able to take in a post request and store it
 * inside of a datbase using mongoose. It will also
 * support get requests sending back the needed information,
 * about purchased items.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public_html"));
app.use(express.json());


const Item = require("./Item.js");
const User = require("./User.js");

mongoose.connect("mongodb://127.0.0.1/ostaa")

/*
 * This is the code that gets ran whenever the user
 * makes a get request to the server for the main page.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public_html/index.html");
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/get/users/", (req, res) => {
  getEverything("user", res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/get/items/", (req, res) => {
  getEverything("item", res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/get/listings/:USERNAME", (req, res) => {
  let curUsername = req.params.USERNAME;
  getAllArrays("listings", curUsername, res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/get/purchases/:USERNAME", (req, res) => {
  let curUsername = req.params.USERNAME;
  getAllArrays("purchases", curUsername, res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/search/users/:KEYWORD", (req, res) => {
  let subValue = req.params.KEYWORD;
  getBySubstring("user", subValue, res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/search/items/:KEYWORD", (req, res) => {
  let subValue = req.params.KEYWORD;
  getBySubstring("item", subValue, res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to create a new user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/add/user/", (req, res) => {
  let userData = req.body;
  // creates the new user
  const newUser = new User({
    username: userData.username,
    password: userData.password,
    listings: [],
    purchases: []
  });
  User.findOne({
      username: userData.username
    })
    .then(responce => {
      if (responce) {
        res.send("Account already exists");
      } else {
        // saves the new user
        newUser.save()
          .then(() => {
            res.send("Success");
          }).catch(err => {
            res.send("Error");
          });
      }
    })
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to create a new item.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/add/item/:USERNAME", (req, res) => {
  let curUsername = req.params.USERNAME;
  let userData = req.body;
  // creates the new user
  const newItem = new Item({
    title: userData.title,
    description: userData.description,
    image: userData.image,
    price: userData.price,
    stat: userData.stat
  });
  User.findOne({
      username: curUsername
    })
    .then(result => {
      // checks if the username exists
      if (result) {
        newItem.save()
          .then(() => {
            // adds the value to the existing array
            result.purchases.push(newItem._id);
            result.save();
            res.send("success")
          });
      } else {
        res.send("invalid username");
      }
    }).catch(err => {
      console.log("error");
      res.send("Error");
    })
});

/*
 * This is the code that gets ran whenever the client
 * makes a dlete request to the server at the url, in order
 * to delete eveything in the database.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.delete("/everything", (req, res) => {
  // deletes all users
  User.deleteMany({})
    .then(() => {
      // deletes all items
      Item.deleteMany({})
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        })
    })
});

/*
 * This will get every item in either the items or the users
 * to be sent back to the user.
 * @param {String} displayVals representing what needs to be displayed.
 * @param {Object} res the responce sent back to the user.
 */
function getEverything(displayVals, res) {
  if (displayVals == "user") {
    var curDisplay = User;
  } else {
    var curDisplay = Item;
  }
  // finds all users
  curDisplay.find({})
    .then((responce) => {
      res.send(responce);
    }).catch(err => {
      res.send(err);
    });
}

/*
 * This will get every item in either the items or the users
 * to be sent back to the user based on if the usernames are matching.
 * @param {String} displayVals representing what needs to be displayed.
 * @param {String} username representing the username to find.
 * @param {Object} res the responce sent back to the user.
 */
function getAllArrays(displayVals, username, res) {
  // finds user with correct username
  User.findOne({
      username: username
    })
    .then((responce) => {
      // checks if username exists
      if (responce) {
        // sends back the correct data
        if (displayVals == "listings") {
          res.send(responce.listings);
        } else {
          res.send(responce.purchases);
        }
      } else {
        res.send("invalid username");
      }
    }).catch(err => {
      res.send(err);
    });
}

/*
 * This will get every item in either the items or the users
 * to be sent back to the user based on if the input is a substring
 * of any of the usernames.
 * @param {String} displayVals representing what needs to be displayed.
 * @param {String} subValue representing the username with the subValue to find.
 * @param {Object} res the responce sent back to the user.
 */
function getBySubstring(displayVals, subValue, res) {
  // determines what values to get
  if (displayVals == "user") {
    var curDisplay = User;
    var searchVal = "username";
  } else {
    var curDisplay = Item;
    var searchVal = "description";
  }
  // searches for all words with the correct substring
  curDisplay.where(searchVal).regex(subValue)
    .then((responce) => {
      res.send(responce);
    }).catch(err => {
      res.send(err);
    });
}

/*
 * This is the code that gets ran whenever the server is
 * being started up.
 */
app.listen(80, () => {
  console.log("server listening on port 80");
});
