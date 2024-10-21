import {HTMLElement} from "node-html-parser";

export const getHeadInfo = (root: HTMLElement): string[] => {
    const infoBox = root.querySelector(".data-header__info-box")?.querySelectorAll("li")
    const info = infoBox?.map(li => li.querySelector("span") as HTMLElement)
        .map(ib => {
            if (ib.querySelector("a"))
                return ib.querySelector("a")?.innerText
            return ib.innerText;
        }).map(s => (s ?? "").trim())

    return info ?? []
}