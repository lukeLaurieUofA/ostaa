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

/*
 * The event listener on the create button which will make
 * a post request to the server with the information about the
 * item to be added.
 */
createButton.addEventListener("click", () => {
  // saves image to db
  const formData = new FormData();
  const fileInput = document.querySelector('input[type="file"]');
  formData.append("image", fileInput.files[0]);
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((responce) => {
      console.log("with responce");
      return responce.json();
    })
    .then((data) => {
      console.log("with url");
      // gets the file name for the image
      var url = data.imageUrl.split("\\");
      url = url[url.length - 1];
      // makes the post request to the correct url
      let curUrl = "/add/item/" + username;
      let curData = {
        title: curTitle.value,
        description: curDescription.value,
        image: url,
        price: curPrice.value,
        stat: curStatus.value,
      };
      postRequest(curUrl, curData);
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
  // sends back to main page
  // window.location.href = "home.html";
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
      } else {
        username = responce;
      }
    });
}
