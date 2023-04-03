/*
 * This will get the values of the elemnts of the DOM so that
 * the user input will be retrieved. It will allow for a user
 * to be able to create a new item to add to the listings.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */

// gets the elements from the DOM
curTitle = document.getElementById("title");
curDescription = document.getElementById("description");
curPrice = document.getElementById("price");
curStatus = document.getElementById("curStatus");
curImage = document.getElementById("image");
createButton = document.getElementById("postButton");
username = "";
findCurUser();

createButton.addEventListener("click", () => {
  // makes the post request to the correct url
  let curUrl = "http://localhost:80/add/item/" + username;
  let curData = {
    title: curTitle.value,
    description: curDescription.value,
    image: curImage.value,
    price: curPrice.value,
    stat: curStatus.value,
  };
  postRequest(curUrl, curData);
  // sends back to main page
  window.location.href = "home.html";
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
      "Content-Type": "application/JSON ",
    },
  })
    .then(() => {
      console.log("success");
    })
    .catch(() => {
      console.log("error");
    });
}

function findCurUser() {
  let url = "http://localhost:80/get/current/user";
  fetch(url)
    .then((data) => {
      return data.text();
    })
    .then((responce) => {
      // sends back to main page if not found
      if (responce == "not found") {
        window.location.href = "index.html";
      } else {
        username = responce;
      }
    });
}
