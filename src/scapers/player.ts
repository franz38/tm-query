import { ClubResource } from "./club";
import {parse} from "node-html-parser";
import { Scrapable } from "./resource";



export interface ITransfer {
  from: string;
  to: string;
  season: string;
  date: string;
  mv: string;
  fee: string;
}

export interface PlayerData {
  name: string;
  fullName: string;
  birthDay: string;
  placeOfBirth: string;
  height: number;
  citizenship: string;
  position: string;
  foot: string;
  agent: string;
  currentClub: string;
  joined: string;
  expires: string;
  outfittet: string;
  socialMedia: string;
  clubs: {[season: string]: string}
  transfers: ITransfer[];
}

export class PlayerResource implements Scrapable{
  id: string;
  scraped: boolean = false;

  data: PlayerData;

  constructor(id: string) {
    this.id = id;
  }

  async scrape() {
    this.data = await scrapePlayer(this.id);
    this.scraped = true;
  }

  async csv(): Promise<string> {
    if (!this.scraped) await this.scrape();
    return `${this.data.name}, ${this.data.birthDay}, ${this.data.placeOfBirth}, ${this.data.citizenship}, ${this.data.position}, ${this.data.foot}, ${this.id}`;
  }

  getClubs(): ClubResource[] {
    const clubs = Object.values(this.data.clubs)
    return clubs.map(v => new ClubResource(v));
  }
}

const scrapeTransfers = async (id: string): Promise<ITransfer[]> => {

    const data = await fetch(`https://www.transfermarkt.com/ceapi/transferHistory/list/${id}`).then(res => res.json())
    
    return data["transfers"].map(transfer => ({
        date: transfer["date"],
        season: transfer["season"],
        from: transfer["from"]["href"],
        to: transfer["from"]["href"],
        mv: transfer["marketValue"],
        fee: transfer["fee"],
    } as ITransfer))    
}

export const scrapePlayer = async (playerId: string): Promise<PlayerData> => {

    const numberId = playerId.split("/").pop() ?? ""
    
    const res = await fetch(`https://www.transfermarkt.com${playerId}`);
    const soup = await res.text();
    const root = parse(soup);

    let plDataBox = root
      .querySelectorAll(".box")
      .filter(
        (box) =>
          box.querySelector(".content-box-headline") &&
          box
            .querySelector(".content-box-headline")
            ?.innerText.toLowerCase()
            .includes("player data")
      );
    
    const spans = plDataBox[0].querySelectorAll("span.info-table__content--bold")
    const labels = plDataBox[0].querySelectorAll("span.info-table__content--regular").map(l => l.innerText.trim().toLowerCase())

    const info = spans.map(sp => {
        if (sp.querySelector("a")) {
            if (sp.querySelector("a")?.querySelector("img"))
                return sp.querySelector("a")?.querySelector("img")?.getAttribute("alt")
            return sp.querySelector("a")?.innerText
        }
        if (sp.querySelector("img")) 
            return sp.querySelectorAll("img").map(img => img.getAttribute("alt")).join(", ")
        return sp.innerText
    }).map(text => text?.replace("&nbsp;&nbsp;", " ").replace("&nbsp;", " ").trim()) as string[]

    const nameBox = root.querySelector(".data-header")?.querySelector(".data-header__headline-wrapper")
    nameBox?.querySelector(".data-header__shirt-number")?.remove()
    const name = nameBox?.innerText.trim() ?? ""

    const transfersData = await scrapeTransfers(numberId)
    const clubs: {[year: string]: string} = {}
    transfersData.forEach(td => {
        clubs[td.season] = td.to
    })

    console.info(`scraped player: ${playerId}`)

    if (!labels[0].includes("name")) {
        return {
            name: name,
            fullName: "",
            birthDay: info[0],
            placeOfBirth: info[1],
            height: +info[2],
            citizenship: info[3],
            position: info[4],
            foot: info[5],
            agent: info[6],
            currentClub:info[7],
            joined: info[8],
            expires: info[9],
            outfittet: info[10],
            socialMedia: info[11],
            transfers: transfersData,
            clubs: clubs
        } as PlayerData
    }

    return {
        name: name,
        fullName: info[0],
        birthDay: info[1],
        placeOfBirth: info[2],
        height: +info[3],
        citizenship: info[4],
        position: info[5],
        foot: info[6],
        agent: info[7],
        currentClub:info[8],
        joined: info[9],
        expires: info[10],
        outfittet: info[11],
        socialMedia: info[12],
        transfers: transfersData,
        clubs: clubs
    } as PlayerData
}