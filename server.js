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
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require('path');
const upload = multer({ dest: __dirname + "/uploads/" });

const app = express();

app.use(express.static("public_html"));
app.use(express.json());
app.use(cookieParser());
app.use("/app/*", authenticate);

const Item = require("./Item.js");
const User = require("./User.js");
const { log } = require("console");

sessions = {};

mongoose.connect("mongodb://127.0.0.1/ostaa");

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
 * This is the code that gets ran whenever the user
 * tries to use cookies to authenticate themselves.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/app/home", (req, res) => {
  res.send("success");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

/*
 * This is the code that gets ran whenever the user
 * tries to get an image saved to the database.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filepath);
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
    purchases: [],
  });
  User.findOne({
    username: userData.username,
  }).then((responce) => {
    if (responce) {
      res.send("Account already exists");
    } else {
      // saves the new user
      newUser
        .save()
        .then(() => {
          res.send("Success");
        })
        .catch((err) => {
          res.send("Error");
        });
    }
  });
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
    stat: userData.stat,
  });
  User.findOne({
    username: curUsername,
  })
    .then((result) => {
      // checks if the username exists
      if (result) {
        newItem.save().then(() => {
          // adds the value to the existing array
          result.listings.push(newItem._id);
          result.save();
          res.send("success");
        });
      } else {
        res.send("invalid username");
      }
    })
    .catch((err) => {
      res.send("Error");
    });
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to check if a user exists in the db.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/valid/user/", (req, res) => {
  let curUsername = req.body.username;
  let curPassword = req.body.password;
  // searches for a user wuth the login credentials

  // look for cookies here

  User.findOne({ username: curUsername, password: curPassword }).then(
    (data) => {
      if (data == null) {
        res.send("fail");
      } else {
        // creates the cookie
        let id = addSession(curUsername);
        // has login for 5 minutes
        res.cookie(
          "login",
          { sessionId: id, user: curUsername },
          { maxAge: 300000, httpOnly: true }
        );
        res.redirect("/app/home");
      }
    }
  );
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to add a new item to a user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/buy/item/:USERNAME", (req, res) => {
  let curUsername = req.params.USERNAME;
  User.findOne({ username: curUsername }).then((data) => {
    if (data == null) {
      res.send("fail");
    } else {
      let curItem = req.body;
      // adds the value to the existing array
      data.purchases.push(curItem._id);
      data.save();
      // changes the status
      Item.findOne({ _id: curItem._id }).then((foundItem) => {
        foundItem.stat = "SOLD";
        foundItem.save();
        res.send("success");
      });
    }
  });
});

/*
 * This will upload the users selected image.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 * @param {Object} The function to be ran if cookie is valid.
 */
app.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = `http://157.230.181.102/${req.file.path}`;
  res.json({ imageUrl: imageUrl });
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
  User.deleteMany({}).then(() => {
    // deletes all items
    Item.deleteMany({})
      .then(() => {
        res.send("success");
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

  // deletes all users
  User.deleteMany({}).then(() => {
    // deletes all items
    Item.deleteMany({})
      .then(() => {
        // res.send("success");
      })
      .catch((err) => {
        // res.send(err);
      });
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
  curDisplay
    .find({})
    .then((responce) => {
      res.send(responce);
    })
    .catch((err) => {
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
    username: username,
  })
    .then((responce) => {
      // checks if username exists
      if (responce) {
        // sends back the correct data
        if (displayVals == "listings") {
          getItemsById(responce.listings, res);
        } else {
          getItemsById(responce.purchases, res);
        }
      } else {
        res.send("invalid username");
      }
    })
    .catch((err) => {
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
  curDisplay
    .where(searchVal)
    .regex(subValue)
    .then((responce) => {
      res.send(responce);
    })
    .catch((err) => {
      res.send(err);
    });
}

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, which
 * finds the user associated with the current cookie.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/get/current/user", (req, res) => {
  let curCookie = req.cookies.login;
  if (curCookie) {
    res.send(curCookie.user);
    return;
  }
  res.send("not found");
});

/*
 * This will generate a random number for a cookies id, then
 * it will save the cookies information in an Object.
 * makes a get request to the server at the url.
 * @param {String} user is a String representing the username.
 */
function addSession(user) {
  let sessionId = Math.floor(Math.random() * 100000);
  let sessionStart = Date.now();
  sessions[user] = { sid: sessionId, start: sessionStart };
  return sessionId;
}

/*
 * This will check if a current cookie still exists inside of
 * the Object.
 * @param {String} user is a String representing the username.
 * @param {Number} sessionId is the id associated with the cookie.
 */
function hasSession(user, sessionId) {
  let entry = sessions[user];
  if (entry != undefined) {
    return entry.sid == sessionId;
  }
  return false;
}

/*
 * This will run every two seconds and check if a cookies time
 * has expired and if it has, then it will remove it from the
 * Object.
 */
function cleanupSessions() {
  let curTime = Date.now();
  for (i in sessions) {
    let curSession = sessions[i];
    // checks if cookie should be removed
    if (curSession.start + 300000 < curTime) {
      delete sessions[i];
    }
  }
}

/*
 * This will check if the user can be validated with cookies.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 * @param {Object} The function to be ran if cookie is valid.
 */
function authenticate(req, res, next) {
  let curCookie = req.cookies.login;
  if (curCookie) {
    // checks if the cookie exists
    var result = hasSession(curCookie.user, curCookie.sessionId);
    if (result) {
      next();
      return;
    }
  }
  res.send("fail");
}

/*
 * This will find all of the items that are associated with
 * an array id's.
 * @param {[Number]} itemIds is the array of id's.
 * @param {Object} res the responce sent back to the user.
 */
async function getItemsById(itemsIds, res) {
  var items = [];
  for (i in itemsIds) {
    // find the item with the id
    var curId = itemsIds[i];
    const foundItem = await Item.findOne({ _id: curId });
    items.push(foundItem);
  }
  res.send(items);
}

setInterval(cleanupSessions, 2000);

/*
 * This is the code that gets ran whenever the server is
 * being started up.
 */
app.listen(80, () => {
  console.log("server listening on port 80");
});
