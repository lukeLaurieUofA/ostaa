/*
 * This will create the schema which defines the layout
 * for what a user must have.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */
const mongoose = require("mongoose");

// creates the schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: String,
  password: String,
  listings: [],
  purchases: []
});

module.exports = mongoose.model("User", userSchema);
