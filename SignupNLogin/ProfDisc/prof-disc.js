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
