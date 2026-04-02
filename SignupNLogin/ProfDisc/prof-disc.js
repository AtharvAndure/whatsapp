// Profile Image and Description Handling need Session Changes.
// Need to Change Database Structure.
const profileImage = document.getElementById("profile-image");
const baseLink=profileImage.getAttribute("data-folder");
const profileFile = document.getElementById("profile-file");

document.addEventListener("DOMContentLoaded", async function () {
    const username=document.getElementById("username");
  try {
    // Request the server-side endpoint that returns session user info
    // fetch relative to the HTML page location -> point to the ProfDisc folder
    const resp = await fetch("./ProfDisc/prof-disc.php", {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (!resp.ok) {
      console.log("Server error status:", resp.status);
      return null;
    }
    const result = await resp.json();
    if(result.status === "success" && result.data && result.data.username){
        username.innerText = result.data.username;
        if(result.data.profile_img && baseLink){
            profileImage.src = `${baseLink}${result.data.profile_img}`;
        } else if(result.data.profile_img && !baseLink){
            // Fallback if data-folder attribute is missing
            profileImage.src = `../asset/images/${result.data.profile_img}`;
        }
        if(result.data.profile_disc){
            document.getElementById("disc").value = result.data.profile_disc;
        }
    } else {
        console.log('Profile fetch error:', result.message || result);
    }

  } catch (err) {
    console.error("runTimeCheck error:", err);
    return null;
  }
});

profileImage.addEventListener("click",function(){
  profileFile.click();
  console.log("Profile-Image Click");
});

profileFile.addEventListener('change', function(event) {
  const file = event.target.files[0]; 
  
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    profileImage.src = imageUrl;
  }
});

async function saveDisc(){
  let profileDescription = document.getElementById("disc").value.trim();
  const profFile=document.getElementById("profile-file");
  const Discdata=new FormData();

  // If the user typed nothing, set a default "Bio"
  if (profileDescription === "") {
    profileDescription = "Hey there! I am using BAATE."; 
  }

  // Only append image if user selected a new one
  if(profFile.files && profFile.files[0]){
    Discdata.append('profileImage',profFile.files[0]);
  }

  Discdata.append("profileDisc", profileDescription);
  
  try {
    // 1. Send the data to your PHP script
    const response = await fetch('./ProfDisc/prof-disc.php', {
      method: 'POST',
      body: Discdata 
    });

    // 2. Wait for the PHP script to send a response back
    const result = await response.json();

    // 3. Check if the HTTP request was successful (status 200-299)
    if (response.ok) {
      console.log("Success! Profile saved:", result);
      window.location.href = 'login.html'; 
    } else {
      // Handle server-side errors (e.g., database failure)
      console.error("Server error:", result.message || "Unknown error occurred.");
      alert("Failed to save profile. Please try again.");
    }

  } catch (error) {
    // 4. Catch network errors (e.g., server is completely offline)
    console.error("Network error:", error);
    alert("Could not connect to the server. Please check your internet connection.");
  }
}