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

sublistingButton.addEventListener("click", () => {
  url = "/search/items/" + sublistingText.value;
  // makes sure an input was given
  if (url != "/search/items/") {
    getItems(url, "search");
  }
});

listingsButton.addEventListener("click", () => {
  url = "/get/listings/" + username;
  getItems(url, "listings");
});

purchasesButton.addEventListener("click", () => {
  url = "/get/purchases/" + username;
  getItems(url, "purchases");
});

createButton.addEventListener("click", () => {
  // sets to the post page
  window.location.href = "post.html";
});

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

function displayItems(items, listType) {
  // resets all items to blank before adding
  itemSection.innerHTML = "";
  for (i in items) {
    // create all of the elements
    const itemContainer = document.createElement("div");
    const itemName = document.createElement("h3");
    const itemImage = document.createElement("img");
    const itemDescription = document.createElement("p");
    const itemPrice = document.createElement("p");
    const itemStatus = document.createElement("p");
    const itemButton = document.createElement("button");
    // add the correct classes
    itemContainer.classList.add("item");
    itemName.classList.add("itemName");
    itemImage.classList.add("itemImage");
    itemDescription.classList.add("itemDescription");
    itemPrice.classList.add("itemDescription");
    itemStatus.classList.add("itemDescription");
    itemButton.classList.add("buyButton");
    // add the correct attributes
    // change to custom image later
    itemImage.setAttribute("src", "images/tape.jpg");
    itemImage.setAttribute("alt", "item image");
    // sets the values
    itemName.innerText = items[i].title;
    itemDescription.innerText = items[i].description;
    itemPrice.innerText = items[i].price;
    itemStatus.innerText = items[i].stat;
    itemButton.innerText = "Buy Now!";

    // adds to the div
    itemContainer.appendChild(itemName);
    itemContainer.appendChild(itemImage);
    itemContainer.appendChild(itemDescription);
    itemContainer.appendChild(itemPrice);
    if (listType == "search") {
      if (itemStatus.innerText == "SOLD") {
        itemStatus.innerText = "Item has been purchased";
        itemContainer.appendChild(itemStatus);
      } else {
        itemContainer.appendChild(itemButton);
        newEventListener(itemButton, items[i]);
      }
    } else if (listType == "listings") {
        itemContainer.appendChild(itemStatus);
    } else {
        itemContainer.appendChild(itemStatus);
    }
    itemSection.appendChild(itemContainer);
  }
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
      }
      username = responce;
      // sets correct title
      introText.innerText =
        "Welcome " + username + "! What would you like to do?";
    });
}

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
        "Content-Type": "application/JSON "
      }
    })
    .then(() => {
      console.log("success");
    }).catch (() => {
      console.log("error");
    })
  }