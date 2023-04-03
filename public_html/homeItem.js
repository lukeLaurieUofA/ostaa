/*
 * This will get the values of the elemnts of the DOM so that
 * the user input will be retrieved. It will allow for a user
 * to be able to search items they previously bought, or search
 * for any listed items.
 * Author: Luke Laurie
 * Date: 3/21/2023
 */

// gets the elements from the DOM
sublistingText = document.getElementById("listingSearch");
sublistingButton = document.getElementById("sublistingButton");
listingsButton = document.getElementById("listingButton");
purchasesButton = document.getElementById("purchaseButton");
createButton = document.getElementById("createButton");
introText = document.getElementById("nameDisplay");
itemSection = document.getElementById("itemSection");

username = "";
findCurUser();

/*
 * The event listener on the sublisitng button which will make
 * a get request to the server with the information about the
 * item that are needed.
 */
sublistingButton.addEventListener("click", () => {
  url = "/search/items/" + sublistingText.value;
  // makes sure an input was given
  if (url != "/search/items/") {
    getItems(url, "search");
  }
});

/*
 * The event listener on the listing button which will make
 * a get request to the server with the information about the
 * item that are needed.
 */
listingsButton.addEventListener("click", () => {
  url = "/get/listings/" + username;
  getItems(url, "listings");
});

/*
 * The event listener on the purchases button which will make
 * a get request to the server with the information about the
 * item that are needed.
 */
purchasesButton.addEventListener("click", () => {
  url = "/get/purchases/" + username;
  getItems(url, "purchases");
});

/*
 * The event listener on the create button which will redirect
 * the user to the post page.
 */
createButton.addEventListener("click", () => {
  // sets to the post page
  window.location.href = "post.html";
});

/*
 * This will send a get request to the backend to a specific url.
 * @param {String} url is the string representing the current url.
 * @param {String} curType is the representation of the button that
 *                 was clicked.
 */
function getItems(url, curTpye) {
  // makes the get requst to the server
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((responce) => {
      // display the items in the box
      displayItems(responce, curTpye);
    })
    .catch((err) => {
      console.log(err);
    });
}

/*
 * The will loop through all of the items and create the elements which
 * can be added to the DOM
 * @param {items} items is the array of items.
 * @param {String} listType is the representation of the clicked button.
 */
function displayItems(items, listType) {
  // resets all items to blank before adding
  itemSection.innerHTML = "";
  for (i in items) {
    // create all of the elements
    const container = document.createElement("div");
    const itemName = document.createElement("h3");
    const itemImage = document.createElement("img");
    const itemDescription = document.createElement("p");
    const itemPrice = document.createElement("p");
    const itemStatus = document.createElement("p");
    // add the correct classes
    container.classList.add("item");
    itemName.classList.add("itemName");
    itemImage.classList.add("itemImage");
    itemDescription.classList.add("itemDescription");
    itemPrice.classList.add("itemDescription");
    itemStatus.classList.add("itemDescription");
    itemImage.setAttribute("src", "/uploads/" + items[i].image);
    itemImage.setAttribute("alt", "item image");
    // sets the values
    itemName.innerText = items[i].title;
    itemDescription.innerText = items[i].description;
    itemPrice.innerText = items[i].price;
    itemStatus.innerText = items[i].stat;
    // adds to the div
    container.appendChild(itemName);
    container.appendChild(itemImage);
    container.appendChild(itemDescription);
    container.appendChild(itemPrice);
    checkStatus(container, items[i], itemStatus, listType);
    itemSection.appendChild(container);
  }
}

/*
 * The will determine the correct value that should be asosciated with
 * the status.
 * @param {Object} container is the container for all the items.
 * @param {Object} curItem is the current item in the loop.
 * @param {Object} statusItem is the item representing the status.
 * @param {String} listType is the representation of the clicked button.
 */
function checkStatus(container, curItem, statusItem, listType) {
  // checks for correct value of the status
  if (listType == "search") {
    if (statusItem.innerText == "SOLD") {
      statusItem.innerText = "Item has been purchased";
      container.appendChild(statusItem);
    } else {
      // creates the button
      const itemButton = document.createElement("button");
      itemButton.classList.add("buyButton");
      container.appendChild(itemButton);
      itemButton.innerText = "Buy Now!";
      newEventListener(itemButton, curItem);
    }
  } else {
    container.appendChild(statusItem);
  }
}

/*
 * The will update the elements of an item whenever the buy button is
 * clicked.
 * @param {Node} curButton is the buy button.
 * @param {Object} curItem is the item associated with the clicked button.
 */
function newEventListener(curButton, curItem) {
  curButton.addEventListener("click", () => {
    let url = "/buy/item/" + username;
    postRequest(url, curItem);
  });
}

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

/*
 * The will use the cookies from the browser to find out who
 * the current user is. If the user does not have cookies they
 * will be rediected to the main page.
 */
function findCurUser() {
  let url = "get/current/user";
  fetch(url)
    .then((data) => {
      return data.text();
    })
    .then((responce) => {
      // sends back to main page if not found
      if (responce == "not found") {
        window.location.href = "index.html";
      }
      username = responce;
      // sets correct title
      introText.innerText =
        "Welcome " + username + "! What would you like to do?";
    });
}
