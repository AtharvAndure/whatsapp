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
    } else {
        console.log('Profile fetch error:', result.message || result);
    }

  } catch (err) {
    console.error("runTimeCheck error:", err);
    return null;
  }
});

const profileImage = document.getElementById("profile-image");
const profileFile = document.getElementById("profile-file");

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
  const profileDisciption = document.getElementById("disc").value.trim();
  const defaultImg="../asset/images/profile-image.png";
  const finalImg= profileImage.src !=defaultImg ? profileImage.src : defaultImg ;
  const data=new FormData();
  data.append(profileImage,finalImg);
  data.append(profileDisc,profileDisciption);
  
  try {
    // 1. Send the data to your PHP script
    const response = await fetch('prof-disc.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data) 
    });

    // 2. Wait for the PHP script to send a response back
    const result = await response.json();

    // 3. Check if the HTTP request was successful (status 200-299)
    if (response.ok) {
      console.log("Success! Profile saved:", result);
      window.location.href = '../../src/index.html'; 
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