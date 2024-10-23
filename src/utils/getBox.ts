import {HTMLElement} from "node-html-parser";

export const getBox = (root: HTMLElement, query: string): HTMLElement => {
    let myBox = root
      .querySelectorAll(".box")
      .find(
        (box) =>
          box.querySelector(".content-box-headline") &&
          box
            .querySelector(".content-box-headline")
            ?.innerText.toLowerCase()
            .includes(query)
      );
    
    if (!myBox)
      throw new Error("Cant find search results")
    
    return myBox
}