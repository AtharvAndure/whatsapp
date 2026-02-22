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

async function runTimeCheck(text){
  const dataToSend=new FormData();
  dataToSend.append("username",text);
  try{
    const response=await fetch(("/whatsapp/SignupNLogin/loginBackend/login.php"),{method:"POST",body:dataToSend});
    if(!response.ok) return null;
    const result=await response.json();
    return result.data; // expected boolean: true if username exists
  }catch(err){
    console.error('runTimeCheck error', err);
    return null;
  }
}
username.addEventListener("keyup", async function() {
  const value = this.value.trim();
  const patternOk = /^[a-zA-Z0-9]{3,15}$/.test(value);
  const nameExists = await runTimeCheck(value);

  if (!patternOk || nameExists === true) {
    this.style.borderBottom = "2px solid red";
    const inv = document.getElementById("invalid-username");
    inv.style.display = "block";
    inv.style.color = "red";
    inv.style.textAlign = "center";
    validName = false;
  } else {
    this.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    document.getElementById("invalid-username").style.display = "none";
    validName = true;
  }
});

function Enter() {}
