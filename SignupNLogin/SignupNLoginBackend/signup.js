// Need to change Session into JWT

const username = document.getElementById("username");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");
const genderRadios = document.querySelectorAll('input[name="gender"]');
const toast = document.getElementById("toast");
const toastText = document.getElementById("text");
const toastImg = document.getElementById("toast-icon");
const btnOTP = document.getElementById("btn-otp");
const otpInput = document.getElementById("otp");
const otpContainer = document.querySelector(".otp-container");

// valid or not
let validName = false;
let checkfirstname = false;
let checklastname = false;
let checkemail = false;
let checkpassword = false;
let checkgender = true; // Male is checked by default
let otpSent = false;
let checkotp = false;

// 1. Select the button
const btnSignup = document.querySelector(".btn-signup");

otpInput.disabled = true;
btnOTP.disabled = true;

function EnableDisable(val) {
  // If val is true, disabled becomes false. If val is false, disabled becomes true.
  firstname.disabled = !val;
  lastname.disabled = !val;
  email.disabled = !val;
  password.disabled = !val;
  // Enable/disable all gender radios
  genderRadios.forEach((radio) => {
    radio.disabled = !val;
  });
}

// Initialize - disable all fields until username is valid
EnableDisable(false);
btnSignup.disabled = true;



// Toast Active and Deactive 
function ToastActiveDeactive(text,status){
  if(status){
    clearTimeout(this.timeout); // Clear previous timeout if user is still typing
    toast.classList.add("toast-active"); // Toast
    toastText.innerHTML = text;
    toastImg.src="../asset/icon/invalid.png";
    toast.style.border="2px solid red";
  }else{
    toast.classList.add("toast-active"); // Toast
    toastText.innerHTML = text;
    toastImg.src="../asset/icon/check.png";
    toast.style.border="2px solid yellowgreen";
    setTimeout(() => {      
      toast.classList.remove("toast-active");
    }, 4000);
  }
}



// Runtime Username Check
async function runTimeCheck(text) {
  const dataToSend = new FormData();
  dataToSend.append("username", text);
  try {
    const response = await fetch("./SignupNLoginBackend/check_user.php", {
      method: "POST",
      body: dataToSend,
      credentials: "include",
    });

    if (!response.ok) {
      console.log("Server error status:", response.status);
      return null;
    }

    const result = await response.json();
    console.log("PHP Response:", result);
    return result.data;
  } catch (err) {
    console.error("runTimeCheck error:", err);
    return null;
  }
}

username.addEventListener("keyup", async function () {
  const value = this.value.trim();
  const patternOk = /^[a-zA-Z0-9]{3,15}$/.test(value);
  const nameExists = await runTimeCheck(value);

  if (!patternOk || nameExists === true) {
    this.style.borderBottom = "2px solid red";
    ToastActiveDeactive("Enter Valid Username",true);
    validName = false;
    EnableDisable(false);
  } else {
    this.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    validName = true;
    ToastActiveDeactive("Username is Valid",false);
    EnableDisable(true);
  }

});
function ValidName(val, text) {
  if (!/^[a-zA-Z]{3,15}$/.test(val.value)) {
    ToastActiveDeactive(text,true);
    val.style.borderBottom = "2px solid red";
    return false;
  } else {
    ToastActiveDeactive(text,false);
    val.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    return true;
  }
}

function checkAllValidations() {
  if (
    validName &&
    checkfirstname &&
    checklastname &&
    checkemail && // Becomes true when OTP is successful
    checkotp && // ADD THIS: Ensure OTP was successful
    checkpassword &&
    checkgender
  ) {
    btnSignup.disabled = false;
  } else {
    btnSignup.disabled = true;
  }
}

// First Name
firstname.addEventListener("input", function () {
  checkfirstname = ValidName(firstname, "Enter Valid First Name");
  checkAllValidations();
});

// Last Name
lastname.addEventListener("input", function () {
  checklastname = ValidName(lastname, "Enter Valid Last Name");
  checkAllValidations();
});

// Email Validation
email.addEventListener("input", function () {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    
    ToastActiveDeactive("Enter Valid Email",true);
    email.style.borderBottom = "2px solid red";
    checkemail = false;
    btnOTP.disabled = true;
  } else {
    ToastActiveDeactive("Valid Email",false);
    email.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    btnOTP.disabled = false;
  }
  checkAllValidations();
});

// 2. Button Click Listener (Triggers the animation)
btnOTP.addEventListener("click", async function () {
  // Add the 'show' class to the OTP container to animate it in
  otpContainer.classList.add("show");
  // Optional: Change the button text or disable the email input so they don't change it after requesting an OTP
  btnOTP.innerText = "RESEND OTP";
  otpInput.disabled = false; // Enable OTP input
  email.disabled = true;

  const data = new FormData();
  data.append("sender_email", email.value);
  try {
    const response = await fetch("./SignupNLoginBackend/sendOtp.php", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    const result = await response.json();
    console.log("OTP Response:", result); // Look at this in your console
    if (result.status === "success") {
      ToastActiveDeactive("OTP sent successfully",false);
    } else {
      ToastActiveDeactive(result.message || "Failed to send OTP",true);
      setTimeout(() => {
        toast.classList.remove("toast-active");
      }, 4000);
    }
  } catch (err) {
    console.error("OTP request error:", err);
    ToastActiveDeactive("An error occurred while sending OTP",true)
    setTimeout(() => {
      toast.classList.remove("toast-active");
    }, 4000);
  }
});

// OTP VALIDATION
otpInput.addEventListener("input", async function () {
  if (this.value.length === 6) {
    const data = new FormData();
    data.append("otp", this.value);
    try {
      const response = await fetch("./SignupNLoginBackend/receiveOtp.php", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const result = await response.json();
      if (result.status === "success") {
        checkotp = true;
        checkemail = true;
        checkAllValidations();
        console.log("OTP Verification Success:", result); // Look at this in your console
        ToastActiveDeactive("OTP verified successfully",false);
      } else {
        console.log("OTP Verification Failed:", result); // Look at this in your console
        checkotp = false;
        checkemail = false;
        email.disabled = false; // Re-enable email input so they can request a new OTP
        checkAllValidations();
        ToastActiveDeactive(result.message || "Invalid OTP",true);
        setTimeout(() => {
          toast.classList.remove("toast-active");
        }, 2000);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      ToastActiveDeactive("An error occurred while verifying OTP",true);
      setTimeout(() => {
        toast.classList.remove("toast-active");
      }, 4000);
    }
  }
});

// PASSWORD VALIDATION
password.addEventListener("input", function () {
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password.value,
    )
  ) {
    ToastActiveDeactive("Enter Valid Password",true);
    setTimeout(()=>{
      toast.classList.remove("toast-active");
    },2000);
    password.style.borderBottom = "2px solid red";
    checkpassword = false;
    cpassword.disabled = true;
  } else {
    cpassword.disabled = false;
    checkpassword = false;
    ToastActiveDeactive("Valid Password",false);
    password.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
  }
  checkAllValidations();
});

// Confirm Password Validation
cpassword.addEventListener("input", function () {
  if (cpassword.value !== password.value) {
    ToastActiveDeactive("Passwords do not match",true);
    setTimeout(()=>{
      toast.classList.remove("toast-active");
    },2000);
    cpassword.style.borderBottom = "2px solid red";
    checkpassword = false;
  } else {
    ToastActiveDeactive("Password Match",false);
    cpassword.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    checkpassword = true;
  }
  checkAllValidations();
});

// Gender Selection Validation
genderRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (document.querySelector('input[name="gender"]:checked')) {
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
      window.location.href = "Prof-Disc.html";
    }, 400);
  }
}

// Form submission handler
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    email.disabled = false;
    otpInput.disabled = false;
    username.disabled = false;

    const formData = new FormData(this);

    try {
      const response = await fetch("./SignupNLoginBackend/signup.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        showSuccessModal();
      } else {
        // Show error in toast
        ToastActiveDeactive(result.message || "Registration failed",true);
        setTimeout(() => {
          toast.classList.remove("toast-active");
        }, 4000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      ToastActiveDeactive("An error occurred during registration",true);
      setTimeout(() => {
        toast.classList.remove("toast-active");
      }, 4000);
    }
  });
