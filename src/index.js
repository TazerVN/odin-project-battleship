import { gameStart, continueButton } from "./gamestate";
import { later } from "./gamestate";
import { mouseDown, mouseUp } from "./dragNdrop";

const title = document.querySelector(".title");
const prompt = document.querySelector(".prompt");
const submitButton = document.querySelector("button.submit");
const gamecontainer = document.querySelector(".game-container");
const body = document.body;
let constrain = 50;

title.style.opacity = "100";
prompt.style.opacity = "100";
gamecontainer.style.display = "none";

continueButton()
gamecontainer.style.display = "flex";

submitButton.addEventListener("click", async () => {
  title.style.opacity = "0";
  prompt.style.opacity = "0";
  gamecontainer.style.display = "flex";
  const move = await later(2000, "continue");
  continueButton();
  body.removeChild(prompt);
  title.style.opacity = "100";
});

funrack(prompt, body);


function funrack(el, elcontainer) {
  elcontainer.addEventListener("mousemove", (e) => {
    let xy = [e.clientX, e.clientY];
    let position = xy.concat([el]);
    window.requestAnimationFrame(function () {
      transformElement(el, position);
    });
  });

  elcontainer.addEventListener("mouseout", (e) => {
    reset(el);
  });
}

function transforms(x, y, el) {
  let object = el.getBoundingClientRect();
  let calcY = (x - object.x - object.width / 2) / constrain;
  let calcX = -(y - object.y - object.height / 2) / constrain;
  return (
    "perspective(400px) " +
    " rotateY(" +
    calcY +
    "deg) " +
    "   rotateX(" +
    calcX +
    "deg) "
  );
}

function reset(el) {
  el.style.transform = "rotateY(0)" + " rotateX(0)";
}
function transformElement(el, xyEl) {
  el.style.transform = transforms.apply(null, xyEl);
}

prompt.addEventListener("mousedown", (e) => mouseDown(e, prompt));

export { funrack };
