replacements.forEach((el, elIndex) => {
    if (el.classList.contains("horizontal")) {
      const currentn = n + elIndex;
      const checkbutton = document.querySelector(
        "#empty" + i.toString() + currentn.toString()
      );
      if (!checkbutton) {
        return null;
      }
      console.log(checkbutton);
      if (n - 1 + replacements.length >= 10) {
        return "not valid";
      }
      if (
        checkbutton.classList.contains("horizontal") ||
        checkbutton.classList.contains("vertical")
      ) {
        return "there is already a ship";
      }
    }
    if (el.classList.contains("vertical")) {
      const currenti = i + elIndex;
      const checkbutton = document.querySelector(
        "#empty" + currenti.toString() + n.toString()
      );
      if (!checkbutton) {
        return;
      }
      console.log(checkbutton);
      if (i - 1 + replacements.length >= 10) {
        return "not valid";
      }
      if (
        checkbutton.classList.contains("horizontal") ||
        checkbutton.classList.contains("vertical")
      ) {
        return "there is already a ship";
      }
    }
  });