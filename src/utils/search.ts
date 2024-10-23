import {parse, HTMLElement} from "node-html-parser";
import { getBox } from "./getBox";


export const search = (query: string, header: string): Promise<string[]> => {
    const _url = `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${query}`;

    const asyncFunc = async (url: string) => {
      const res = await fetch(url);
      const soup = await res.text();
      const root = parse(soup);

      const box = getBox(root, header);

      const rows = box
        ?.querySelector("tbody")
        ?.querySelectorAll("tr") as HTMLElement[];

      const td = rows[0].querySelectorAll("td")
        .find(
          td => td.querySelectorAll("a").length > 0 && 
          td.querySelectorAll("a")?.some(a => a.getAttribute("href") != "#")
        )

      const playerId = td?.querySelectorAll("a")
        .find(a => a.getAttribute("href") != "#")?.getAttribute("href") ?? ""

      return playerId;
    };

    const id = asyncFunc(_url).then((res) => [res]);
    return id
}