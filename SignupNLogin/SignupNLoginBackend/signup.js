const username = document.getElementById("username");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");
const genderRadios = document.querySelectorAll('input[name="gender"]');
const toast = document.getElementById("toast");
const toastText=document.getElementById("text");

// valid or not
let validName = false;
let checkfirstname=false;
let checklastname=false;
let checkemail=false;
let checkpassword=false;
let checkgender=true; // Male is checked by default

// 1. Select the button
const btnSignup = document.querySelector(".btn-signup");


function EnableDisable(val) {
  // If val is true, disabled becomes false. If val is false, disabled becomes true.
  firstname.disabled = !val;
  lastname.disabled = !val;
  email.disabled = !val;
  password.disabled = !val;
  
  // Enable/disable all gender radios
  genderRadios.forEach(radio => {
    radio.disabled = !val;
  });
}

// Initialize - disable all fields until username is valid
EnableDisable(false);
btnSignup.disabled = true;

async function runTimeCheck(text) {
  const dataToSend = new FormData();
  dataToSend.append("username", text);
  try {
    const response = await fetch("./loginBackend/login.php", { 
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
    toastText.innerHTML="Enter Valid Username";
    validName = false;
    EnableDisable(false);
  } else {
    this.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    validName = true;
    toast.classList.remove("toast-active");
    EnableDisable(true);
  }
});
function ValidName(val, text, checkVar) {
  if(!/^[a-zA-Z]{3,15}$/.test(val.value)){
    toastText.innerHTML=text;
    toast.classList.add("toast-active");
    val.style.borderBottom = "2px solid red";
    return false;
  }else{
    toast.classList.remove("toast-active");
    val.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    return true;
  }
}

function checkAllValidations() {
  if(validName && checkfirstname && checklastname && checkemail && checkpassword && checkgender){
    btnSignup.disabled = false;
  } else {
    btnSignup.disabled = true;
  }
}

// First Name
firstname.addEventListener("input",function(){
  checkfirstname = ValidName(firstname,"Enter Valid First Name");
  checkAllValidations();
});

// Last Name
lastname.addEventListener("input",function(){
  checklastname = ValidName(lastname,"Enter Valid Last Name");
  checkAllValidations();
});

// Email Validation
email.addEventListener("input",function(){
  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)){
    toastText.innerHTML="Enter Valid Email";
    toast.classList.add("toast-active");
    email.style.borderBottom = "2px solid red";
    checkemail = false;
  }else{
    toast.classList.remove("toast-active");
    email.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    checkemail=true;
  }
  checkAllValidations();
});

// Password Validation
password.addEventListener("input",function(){
  if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password.value)){
    toastText.innerHTML="Enter Valid Password";
    toast.classList.add("toast-active");
    password.style.borderBottom = "2px solid red";
    checkpassword = false;
    cpassword.disabled = true;
  }else{
    cpassword.disabled = false;
    toast.classList.remove("toast-active");
    password.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    checkpassword=true;
  }
  checkAllValidations();
});

// Confirm Password Validation
cpassword.addEventListener("input",function(){
  if (cpassword.value !== password.value) {
    toastText.innerHTML = "Passwords do not match";
    toast.classList.add("toast-active");
    cpassword.style.borderBottom = "2px solid red";
    checkpassword = false;
  } else {
    toast.classList.remove("toast-active");
    cpassword.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    checkpassword=true;
  }
  checkAllValidations();
});

// Gender Selection Validation
genderRadios.forEach(radio => {
  radio.addEventListener("change", function(){
    if(document.querySelector('input[name="gender"]:checked')){
      checkgender = true;
    }
    checkAllValidations();
  });
});

// === SUCCESS MODAL FUNCTIONALITY ===
function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "flex";
    // Add animation
    setTimeout(() => {
      modal.classList.add("modal-show");
    }, 10);
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.remove("modal-show");
    setTimeout(() => {
      modal.style.display = "none";
      // Redirect to login page
      window.location.href = "login.html";
    }, 400);
  }
}

// Form submission handler
document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  
  try {
    const response = await fetch("./SignupNLoginBackend/signup.php", {
      method: "POST",
      body: formData
    });
    
    const result = await response.json();
    
    if (result.status === "success") {
      showSuccessModal();
    } else {
      // Show error in toast
      toastText.innerHTML = result.message || "Registration failed";
      toast.classList.add("toast-active");
      setTimeout(() => {
        toast.classList.remove("toast-active");
      }, 4000);
    }
  } catch(err) {
    console.error('Form submission error:', err);
    toastText.innerHTML = "An error occurred during registration";
    toast.classList.add("toast-active");
    setTimeout(() => {
      toast.classList.remove("toast-active");
    }, 4000);
  }
});

