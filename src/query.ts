import { parse, HTMLElement } from "node-html-parser";
import { ClubTable } from "./tables/ClubTable";
import { PlayerTable } from "./tables/PlayerTable";
import { CompetitionTable } from "./tables/CompetitionTable";
import { getBox } from "./utils/getBox";

export class Query {
//   static getPlayer(id: string): PlayerTable {
//     return new PlayerTable([id]);
//   }

//   static getClub(id: string): ClubTable {
//     return new ClubTable([id]);
//   }

  static searchClub(query: string): ClubTable {
    const _url = `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${query}`;

    const asyncFunc = async (url: string) => {
        const res = await fetch(url);
        const soup = await res.text();
        const root = parse(soup);

        const boxes = root
        .querySelectorAll(".box")
        .filter(
            (box) =>
            box.querySelector(".responsive-table") &&
            box.querySelector("h2") &&
            box.querySelector("h2")?.innerText.toLowerCase().includes("clubs")
        );

        const rows = boxes[0]
        ?.querySelector("tbody")
        ?.querySelectorAll("tr") as HTMLElement[];

        const clubId = rows[0]
        .querySelectorAll("tr")[0]
        .querySelector("a")
            ?.getAttribute("href") as string;
        
        return clubId
    }

    const id = asyncFunc(_url).then(res => [res])
    return new ClubTable(id);
  }

  static searchPlayer(query: string): PlayerTable {
    const _url = `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${query}`;

    const asyncFunc = async (url: string) => {
        const res = await fetch(url);
        const soup = await res.text();
        const root = parse(soup);

        const box = getBox(root, "players")

        const rows = box
          ?.querySelector("tbody")
          ?.querySelectorAll("tr") as HTMLElement[];

        const playerId = rows[0]
          .querySelectorAll("tr")[0]
          .querySelectorAll("a")
            .map(a => a?.getAttribute("href") as string)
            .find(v => v !== "#") ?? ""
            
        return playerId
    }

    const id = asyncFunc(_url).then(res => [res])
    return new PlayerTable(id);
  }

  static getCompetition(id: string): CompetitionTable {
    return new CompetitionTable(new Promise(res => [id]))
  }
}
