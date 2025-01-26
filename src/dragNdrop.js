let newX = 0,
  newY = 0,
  startX = 0,
  startY = 0;
let globalEl;

function mouseDown(e, el) {
  globalEl = el;
  startX = e.clientX;
  startY = e.clientY;
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", (e) => mouseUp(e, el));
}

function mouseMove(e) {
  newX = startX - e.clientX;
  newY = startY - e.clientY;
  startX = e.clientX;
  startY = e.clientY;
  globalEl.style.top = (globalEl.offsetTop - newY )+ "px";
  globalEl.style.left = (globalEl.offsetLeft - newX) + "px";
}

function mouseUp(e, el) {
  document.removeEventListener("mousemove", mouseMove);
}

function resetXY() {
  (newX = 0), (newY = 0), (startX = 0), (startY = 0);
}



export { mouseDown, mouseUp, resetXY };
