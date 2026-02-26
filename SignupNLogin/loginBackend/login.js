const toast = document.getElementById("toast");
const toastText=document.getElementById("text");

async function runTimeCheck(username,password) {
  const dataToSend = new FormData();
  dataToSend.append("username", username);
  dataToSend.append("password",password);
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
    return result; 
    
  } catch(err) {
    console.error('runTimeCheck error:', err);
    return null;
  }
}

document.getElementById("loginform").addEventListener("submit", async function(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const username = usernameInput ? usernameInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (username === "" || password === "") {
    toastText.innerHTML = "Enter Username and password";
    toast.classList.add("toast-active");
    setTimeout(function(){
      toast.classList.remove("toast-active");
    },3000);
    return;
  }

  const result = await runTimeCheck(username, password);
    if (result && result.status === "success" && result.data === true) {
      // Redirect to Profile/Discussion page on successful login
      window.location.href = "../SignupNLogin/Prof-Disc.html";
  } else {
    toastText.innerHTML = (result && result.message) ? result.message : "Enter Valid Username and Password";
    toast.classList.add("toast-active");
    setTimeout(function(){
      toast.classList.remove("toast-active");
    },3000);
  }
});