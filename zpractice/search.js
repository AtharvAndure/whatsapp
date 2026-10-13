let t;
async function sendRequest(){
    let input=document.getElementById("searchInput").value;
    const response=await fetch("https://demo.dataverse.org/api/search?q="+input);
    const result=await response.json();
    console.log(result);
}
document.getElementById("searchInput").addEventListener("input",function(){
    clearTimeout(t);
    t=setTimeout(function(){
        sendRequest();
    },500);
});