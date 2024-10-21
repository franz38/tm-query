import {HTMLElement} from "node-html-parser";

export const getBox = (root: HTMLElement, query: string): HTMLElement => {
    let myBox = root
      .querySelectorAll(".box")
      .filter(
        (box) =>
          box.querySelector(".content-box-headline") &&
          box
            .querySelector(".content-box-headline")
            ?.innerText.toLowerCase()
            .includes(query)
      );
    return myBox[0]
}