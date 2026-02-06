async function load(filename, event) {
  if (!event && !filename) {
    return;
  } else {
    const div = document.getElementsByClassName("left-items")[0];
    const file = await fetch(filename);
    if (!file.ok) throw new Error(file.status + ' ' + file.statusText);
    console.log("file=" + file);
    const text = await file.text();
    console.log("text" + text);
    div.innerHTML = text;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultTab = document.querySelector(".left-container a");
  load("component/message.html", defaultTab);
});
