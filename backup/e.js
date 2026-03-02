document.getElementById("img").addEventListener("change", async function(event){
    const img = event.target.files[0];

    if(img){
        const formData = new FormData();
        formData.append("img", img);

        try{
            const response = await fetch("e.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            
            if(result.status === "success"){
                console.log("Image uploaded and stored successfully:", result);
                alert("Image uploaded successfully!");
            } else {
                console.error("Error:", result.message);
                alert("Error: " + result.message);
            }
        }catch(e){
            console.error("Failed to Fetch Result:", e);
            alert("Failed to upload image");
        }
    }
});