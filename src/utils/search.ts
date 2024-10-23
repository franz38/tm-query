import {parse, HTMLElement} from "node-html-parser";
import { getBox } from "./getBox";


export const search = (query: string, header: string): Promise<string[]> => {
    const _url = `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${query}`;

    const asyncFunc = async (url: string) => {
      const res = await fetch(url);
      const soup = await res.text();
      const root = parse(soup);

      const box = getBox(root, "players");

      const rows = box
        ?.querySelector("tbody")
        ?.querySelectorAll("tr") as HTMLElement[];

      const playerId =
        rows[0]
          .querySelectorAll("tr")[0]
          .querySelectorAll("a")
          .map((a) => a?.getAttribute("href") as string)
          .find((v) => v !== "#") ?? "";

      return playerId;
    };

    const id = asyncFunc(_url).then((res) => [res]);
    return id
}