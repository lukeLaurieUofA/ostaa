/*
 * This will get the values of the elemnts of the DOM so that
 * the user input will be retrieved. Then whenever the add
 * user and add item are clicked it will send a request to the
 * server to store the value in a database.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */
// gets the elements from the DOM
newUsername = document.getElementById("username");
newPassword = document.getElementById("password");
title = document.getElementById("title");
description = document.getElementById("description");
image = document.getElementById("image");
price = document.getElementById("price");
curStatus = document.getElementById("curStatus");
loginUsername = document.getElementById("loginUsername");
userButton = document.getElementById("userButton");
itemButton = document.getElementById("itemButton");

/*
 * The event listener on the add user button which will make
 * a post request to the server with the information about the
 * user to be added.
 */
userButton.addEventListener("click", () => {
  // makes the post request to the correct url
  let curUrl = "/add/user/";
  let curData = {
    username: newUsername.value,
    password: newPassword.value
  };
  postRequest(curUrl, curData);
});

/*
 * The event listener on the add user button which will make
 * a post request to the server with the information about the
 * item to be added.
 */
itemButton.addEventListener("click", () => {
  // makes the post request to the correct url
  let curUsername = loginUsername.value;
  if (curUsername == "") {
    curUsername = "noUsernameGiven";
  }
  let curUrl = "/add/item/" + curUsername;
  let curData = {
    title: title.value,
    description: description.value,
    image: image.value,
    price: price.value,
    stat: curStatus.value
  };
  postRequest(curUrl, curData);
});

/*
 * This will send a post rquest to the backend given data that
 * was given by the user.
 * @param {String} url is the string representing the current url.
 * @param {Object} data is the object that needs to be sent to the backend.
 */
function postRequest(url, data) {
  // makes a post rquest to the backend
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/JSON "
    }
  });
}
