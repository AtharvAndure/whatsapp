const username = document.getElementById("username");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");
const toast = document.getElementById("toast");
const toastText=document.getElementById("text");

// 1. Select the button
const btnSignup = document.querySelector(".btn-signup");

let validName = false;

function EnableDisable(val) {
  // If val is true, disabled becomes false. If val is false, disabled becomes true.
  firstname.disabled = !val;
  lastname.disabled = !val;
  email.disabled = !val;
  password.disabled = !val;
  cpassword.disabled = !val;
  btnSignup.disabled = !val;
}

async function runTimeCheck(text) {
  const dataToSend = new FormData();
  dataToSend.append("username", text);
  try {
    const response = await fetch("/whatsapp/SignupNLogin/loginBackend/login.php", { 
      method: "POST", 
      body: dataToSend 
    });
    
    if (!response.ok) {
      console.log("Server error status:", response.status);
      return null;
    }
    
    const result = await response.json();
    console.log("PHP Response:", result); // Look at this in your console
    return result.data; 
    
  } catch(err) {
    console.error('runTimeCheck error:', err);
    return null;
  }
}

username.addEventListener("keyup", async function() {
  const value = this.value.trim();
  const patternOk = /^[a-zA-Z0-9]{3,15}$/.test(value);
  const nameExists = await runTimeCheck(value);

  console.log("Pattern OK:", patternOk, "| Name Exists:", nameExists); // Look at this in your console

  const inv = document.getElementById("invalid-username");

  if (!patternOk || nameExists === true) {
    this.style.borderBottom = "2px solid red";
    toast.classList.add("toast-active");                             // Toast
    toastText.innerHTML="Enter Valid Text";
    validName = false;
    EnableDisable(false);
  } else {
    this.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    validName = true;
    toast.classList.remove("toast-active");
    EnableDisable(true);
  }
});

firstname.addEventListener("input",function(){
  if(firstname!="" && /^[a-zA-Z]{3,15}$/.test(firstname)){
    
  }else{
    
  }
});
function Enter() {

}