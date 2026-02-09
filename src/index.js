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







document.addEventListener("DOMContentLoaded", () => {
  const resizer = document.getElementById("dragMe");
  const leftSide = document.getElementById("leftItems");

  // Only setup resizer if elements exist and not on mobile
  if (!resizer || !leftSide) return;
  if (window.innerWidth <= 768) return;

  let x = 0;
  let w = 0;

  const mouseDownHandler = function (e) {
    // Get current mouse position
    x = e.clientX;

    // Calculate current width of the left side
    const styles = window.getComputedStyle(leftSide);
    w = parseInt(styles.width, 10);

    // Prevent text selection during drag
    e.preventDefault();
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    // Add listeners to document so dragging continues even if mouse leaves the resizer
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    
    // Add active class or styling during drag
    resizer.classList.add("resizer-active");
  };

  const mouseMoveHandler = function (e) {
    // Calculate how far mouse has moved
    const dx = e.clientX - x;

    // Update width (the CSS min/max-width will handle the limits)
    leftSide.style.width = `${w + dx}px`;
  };

  const mouseUpHandler = function () {
    // Remove listeners when mouse is released
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    
    // Restore cursor and selection
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "auto";
    
    resizer.classList.remove("resizer-active");
  };

  // Only add event listener if not on mobile
  if (!resizer.hasListener) {
    resizer.addEventListener("mousedown", mouseDownHandler);
    resizer.hasListener = true;
  }

  // Handle window resize - disable/enable resizer based on screen size
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768 && resizer.hasListener) {
      resizer.removeEventListener("mousedown", mouseDownHandler);
      resizer.hasListener = false;
    } else if (window.innerWidth > 768 && !resizer.hasListener) {
      resizer.addEventListener("mousedown", mouseDownHandler);
      resizer.hasListener = true;
    }
  });
});