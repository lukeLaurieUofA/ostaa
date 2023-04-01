/*
 * This will get the values of the elemnts of the DOM so that
 * the user input will be retrieved. It will allow for a user
 * to be able to create a new account and login to an existing
 * account
 * Author: Luke Laurie
 * Date: 3/21/2023
 */
// gets the elements from the DOM
loginUsername = document.getElementById("usernameLogin");
loginPassword = document.getElementById("passwordLogin");
registerUsername = document.getElementById("usernameRegister");
registerPassword = document.getElementById("passwordRegister");
loginButton = document.getElementById("loginButton");
registerButton = document.getElementById("registerButton");
invalidText = document.getElementById("invalaidLogin");

/*
 * The event listener on the register button which will make
 * a post request to the server with the information about the
 * user to be added.
 */
registerButton.addEventListener("click", () => {
  // makes the post request to the correct url
  let curUrl = "http://localhost:80/add/user/";
  let curData = {
    username: registerUsername.value,
    password: registerPassword.value,
  };
  postRequest(curUrl, curData, false);
});

/*
 * The event listener on the login button which will make
 * a post request to the server with the information about the
 * user to be logged in.
 */
loginButton.addEventListener("click", () => {
  // makes the post request to the correct url
  let curUrl = "http://localhost:80/valid/user/";
  let curData = {
    username: loginUsername.value,
    password: loginPassword.value,
  };
  postRequest(curUrl, curData, true);
});

/*
 * This will send a post rquest to the backend given data that
 * was given by the user.
 * @param {String} url is the string representing the current url.
 * @param {Object} data is the object that needs to be sent to the backend.
 */
function postRequest(url, data, isLogin) {
  // makes a post rquest to the backend
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/JSON ",
    },
  })
    .then((data) => {
      return data.text();
    }).then((responce) => {
        if (!isLogin) {
            alert("User Created!");
        } else if (responce == "success") { 
            window.location.href = "home.html";
        } else { 
            invalidText.style.display = "block";
        }
    })
    .catch(() => {
      console.log("error");
    });
}
