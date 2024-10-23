import { parse, HTMLElement } from "node-html-parser";
import { ClubTable } from "./tables/ClubTable";
import { PlayerTable } from "./tables/PlayerTable";
import { CompetitionTable } from "./tables/CompetitionTable";
import { search } from "./utils/search";

export class TMQuery {
  static getPlayer(id: string): PlayerTable {
    return new PlayerTable(new Promise((res) => res([id])));
  }

  static getClub(id: string): ClubTable {
    return new ClubTable(new Promise((res) => res([id])));
  }

  static getCompetition(id: string): CompetitionTable {
    return new CompetitionTable(new Promise((res) => [id]));
  }

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

      return clubId;
    };

    const id = asyncFunc(_url).then((res) => [res]);
    return new ClubTable(id);
  }

  static searchPlayer(query: string): PlayerTable {
    const id = search(query, "players")
    return new PlayerTable(id);
  }

}
