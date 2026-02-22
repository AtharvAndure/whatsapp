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
let _usernameDebounce = null;

async function runTimeCheck(text){
  const dataToSend=new FormData();
  dataToSend.append("username",text);
  try{
    const response=await fetch(("../loginBackend/login.php"),{method:"POST",body:dataToSend});
    if(!response.ok) return null;
    const result=await response.json();
    console.log('runTimeCheck response', result);
    // normalize different possible return types (bool, string, int)
    if(result && Object.prototype.hasOwnProperty.call(result, 'data')){
      const d = result.data;
      if(d === true || d === 1 || d === '1' || d === 'true') return true;
      if(d === false || d === 0 || d === '0' || d === 'false') return false;
      // fallback: coerce truthy values to true
      return Boolean(d);
    }
    return null;
  }catch(err){
    console.error('runTimeCheck error', err);
    return null;
  }
}
username.addEventListener("keyup", async function() {
  const input = this;
  const value = input.value.trim();

  // hide message when empty
  const inv = document.getElementById("invalid-username");
  if(!value){
    input.style.borderBottom = "";
    if(inv) inv.style.display = "none";
    validName = false;
    return;
  }

  // debounce network checks
  if(_usernameDebounce) clearTimeout(_usernameDebounce);
  _usernameDebounce = setTimeout(async () => {
    const patternOk = /^[a-zA-Z0-9]{3,15}$/.test(value);
    const nameExists = await runTimeCheck(value);

    if (!patternOk) {
      input.style.borderBottom = "2px solid red";
      if(inv){ inv.textContent = 'Invalid format (3-15 letters/numbers)'; inv.style.display = 'block'; inv.style.color = 'red'; inv.style.textAlign = 'center'; }
      validName = false;
      return;
    }

    if (nameExists === true) {
      input.style.borderBottom = "2px solid red";
      if(inv){ inv.textContent = 'Username already taken'; inv.style.display = 'block'; inv.style.color = 'red'; inv.style.textAlign = 'center'; }
      validName = false;
      return;
    }

    // available
    input.style.borderBottom = "2px solid rgba(61, 246, 255, 0.3)";
    if(inv) inv.style.display = "none";
    validName = true;
  }, 300);
});

function Enter() {}
