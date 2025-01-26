const container = document.querySelector(".grid-container");
const gamecontainer = document.querySelector(".game-container");
let constrain = 20

function transforms(x, y, el) {
  let object = el.getBoundingClientRect();
  let calcY = (x - object.x - object.width / 2)/constrain;

  return "perspective(100px) " + " rotateY(" + calcY + "deg) ";
}

function transformElement(el, xyEl) {
  el.style.transform = transforms.apply(null, xyEl);
}

container.addEventListener("mouseover", (e) => {
  let xy = [e.clientX, e.clientY];
  let position = xy.concat([container]);
  window.requestAnimationFrame(function () {
    transformElement(container, position);
  });
});

export {transform}