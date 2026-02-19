const username = document.getElementById("username");
const firstname = document.getElementById("fastname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");

let validName = false;
let ValidFirstName = false;
let ValidLastName = false;
let ValidEmail = false;
let ValidPassword = false;

username.addEventListener("keyup", function () {
  if (!/^[a-zA-Z0-9]{3,15}$/.test(this.value)) {
    this.style.borderBottom="2px solid red";
    document.getElementById("invalid-username").style.display="block";
    document.getElementById("invalid-username").style.color="red";
    document.getElementById("invalid-username").style.textAlign="center";
  }else{
    this.style.borderBottom="2px solid rgba(61, 246, 255, 0.3)";
    document.getElementById("invalid-username").style.display="none";
  }
});

function Enter() {}
