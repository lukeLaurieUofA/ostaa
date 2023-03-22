/*
 * This will create the schema which defines the layout
 * for what a item must have.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */
const mongoose = require("mongoose");

// creates the schema
var Schema = mongoose.Schema;
var itemSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  stat: String
});

module.exports = mongoose.model("Item", itemSchema);
