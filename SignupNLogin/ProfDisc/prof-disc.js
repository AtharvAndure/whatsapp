// Profile Image and Description Handling need Session Changes.
// Need to Change Database Structure.
const profileImage = document.getElementById("profile-image");
const baseLink = profileImage.getAttribute("data-folder");
const profileFile = document.getElementById("profile-file");

document.addEventListener("DOMContentLoaded", async function () {
  const username = document.getElementById("username");
  try {
    const resp = await fetch("./ProfDisc/prof-disc.php", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!resp.ok) {
      console.log("Server error status:", resp.status);
      return null;
    }
    const result = await resp.json();
    if (result.status === "success" && result.data && result.data.username) {
      username.innerText = result.data.username;
      
      if (result.data.profile_img && baseLink) {
        profileImage.src = `${baseLink}${result.data.profile_img}`;
      } else if (result.data.profile_img && !baseLink) {
        profileImage.src = `../asset/images/${result.data.profile_img}`;
      }
      
      // FIXED: Mapped to 'profile_desc' matching the SQL table column
      if (result.data.profile_desc) {
        document.getElementById("disc").value = result.data.profile_desc;
      }
    } else {
      console.log("Profile fetch error:", result.message || result);
      // FIXED: Removed '/whatsapp' prefix for Docker web root compatibility
      window.location.href = "/SignupNLogin/login.html";
    }
  } catch (err) {
    console.error("runTimeCheck error:", err);
    return null;
  }
});

profileImage.addEventListener("click", function () {
  profileFile.click();
  console.log("Profile-Image Click");
});

profileFile.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    profileImage.src = imageUrl;
  }
});

async function saveDisc() {
  let profileDescription = document.getElementById("disc").value.trim();
  const profFile = document.getElementById("profile-file");
  const Discdata = new FormData();

  if (profileDescription === "") {
    profileDescription = "Hey there! I am using BAATE.";
  }

  if (profFile.files && profFile.files[0]) {
    Discdata.append("profileImage", profFile.files[0]);
  }

  Discdata.append("profileDisc", profileDescription);

  try {
    const response = await fetch("./ProfDisc/prof-disc.php", {
      method: "POST",
      body: Discdata,
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      console.log("Success! Profile saved:", result);
      window.location.href = "../src/index.html";
    } else {
      console.error("Server error:", result.message || "Unknown error occurred.");
      alert("Failed to save profile. Please try again.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Could not connect to the server. Please check your internet connection.");
  }
}