import { PlayerResource } from "./playerResource";
import {parse} from "node-html-parser";
import { Scrapable } from "./resource";


export interface ClubData {
    name: string;
    squadSize: number;
    avgAge: number;
    foreigners: number;
    ntPlayers: number;
    stadium: string;
    currentTr: number;

    players: string[];
}

export class ClubResource implements Scrapable{
  id: string;
  scraped: boolean = false;

  data: ClubData;

  constructor(id: string) {
    this.id = id;
  }

  async scrape(season?: string) {
    this.data = await scrapeClub(this.id, season)
    this.scraped = true;
  }

  toString() {
    if (this.scraped)
      return `${this.data.name}:\n\tsize: ${this.data.squadSize},\n\tage: ${this.data.avgAge},\n\tforeigners: ${this.data.foreigners},\n\tntPlayers: ${this.data.ntPlayers},\n\tstadium: ${this.data.stadium}`;
    return this.id;
  }

  async csv(): Promise<string> {
    if (!this.scraped) await this.scrape();
    return `${this.data.name}, ${this.data.squadSize}, ${this.data.avgAge}, ${this.data.foreigners}, ${this.data.ntPlayers}, ${this.data.stadium}`;
  }

  getPlayers(season?: string): PlayerResource[] {
    // return new PlayerTable(this.players);
    return this.data.players.map((p) => new PlayerResource(p));
  }
}

export const scrapeClub = async (clubId: string, season?: string): Promise<ClubData> => {
    
    const seasonQuery = season ? `/plus/0/galerie/0?saison_id=${season}` : ""
    const url = `https://www.transfermarkt.com${clubId}${seasonQuery}`

    const res = await fetch(url);
    const soup = await res.text();
    const root = parse(soup);

    const playersTable = root
        .querySelector(".vereinsstartseite")
        ?.querySelector("table.items");
    const h = playersTable
        ?.querySelector("thead")
        ?.querySelectorAll("th")
        .map((v) => v.innerText);
    const rows = playersTable
        ?.querySelector("tbody")
        ?.querySelectorAll("tr.odd, tr.even")
        .map((row) => {
            const tmp = row.querySelectorAll("td")[1];
            if (tmp) {
                return tmp
                    .querySelector("td.hauptlink")
                    ?.querySelector("a")
                    ?.getAttribute("href");
            }
            else return null;
        });

    const info = root.querySelectorAll(".data-header__label").map((v) => {
        const span = v.querySelector("span");

        if (span?.querySelector("a"))
        return span?.querySelector("a")?.innerText.trim();
        return span?.innerText.trim();
    }) as string[];

    console.info(`scraped club: ${clubId}/${seasonQuery}`)

    const data: ClubData = {
        name: root.querySelector("h1.data-header__headline-wrapper")
            ?.innerText.trim() ?? "",
        squadSize: +info[3],
        avgAge: +info[4],
        foreigners: +info[5],
        ntPlayers: +info[6],
        stadium: info[7],
        currentTr: -1,
        players: rows as string[]
    }

    return data
}