import { ClubResource } from "./club";
import {parse, HTMLElement} from "node-html-parser";
import { Scrapable } from "./resource";
import { getBox } from "../utils/getBox";
import { Scaper } from "./scraper";



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
  marketValue: MarketValue[];
  stats: Stat[];
  clubs: {[season: string]: string}
  transfers: ITransfer[];
}

export interface MarketValue {
  playerId: string;
  playerName: string;
  mv: string;
  date: string;
  club: string;
  age: string;
}

export interface Stat {
    playerId: string;
    playerName: string;
    season: string;
    competition: string;
    club: string;
    squad: number;
    appearences: number;
    ppg: number;
    gs: number;
    ass: number;
    og: number;
    subOn: number;
    subOff: number;
    yellowCards: number;
    secondYellow: number;
    redCards: number;
    penaltyGoals: number;
    minutesPrGoal: number;
    minutesPlayed: number;
}

export class PlayerResource implements Scrapable{
  id: string;
  scraped: boolean = false;

  data: PlayerData;

  constructor(id: string) {
    this.id = id;
  }

  async scrape() {
    this.data = await Scaper.getInstance().scrapePlayer(this.id);
    this.scraped = true;
  }

  async csv(): Promise<string> {
    if (!this.scraped) await this.scrape();
    return `${this.data.name}, ${this.data.birthDay}, ${this.data.placeOfBirth}, ${this.data.citizenship}, ${this.data.position}, ${this.data.foot}, ${this.id}`;
  }

  async getData(): Promise<any> {
    if (!this.scraped) await this.scrape()

  }

  async getMarketValue(): Promise<MarketValue[]> {
      if (!this.scraped) await this.scrape()
      return this.data.marketValue
  }

  async getStats(): Promise<Stat[]> {
      if (!this.scraped) await this.scrape()
      return this.data.stats
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

const scraperMarketValue = async (playerId: string, playerName: string): Promise<MarketValue[]> => {
  const numberId = playerId.split("/").pop() ?? ""  
  const url = `https://www.transfermarkt.com/ceapi/marketValueDevelopment/graph/${numberId}`

  const raw_data = await fetch(url).then(res => res.json())
  const data = (raw_data["list"] as any[])
      .map(v => ({
        mv: v["mw"],
        age: v["age"],
        club: v["verein"],
        date: v["datum_mw"],
        playerId: playerId,
        playerName: playerName
      } as MarketValue))
    return data
}

const scrapeStats = async (playerId: string, playerName: string): Promise<Stat[]> => {
    const _tmp = playerId.split("/profil/spieler")
    const playerNumber = _tmp[1].replace("/", "")
    const playerNameCode = _tmp[0].replace("/", "")
    const url = `https://www.transfermarkt.com/${playerNameCode}/leistungsdatendetails/spieler/${playerNumber}/saison/verein/0/liga/0/wettbewerb/pos/0/trainer_id/0/plus/1`

    const res = await fetch(url);
    const soup = await res.text();
    const root = parse(soup);

    const box = getBox(root, "detailed stats")
    const rows = box.querySelector("table.items")?.querySelector("tbody")?.querySelectorAll("tr")
    const dd = rows?.map(row => {
      const tds = row.querySelectorAll("td")
      if (tds.length == 17) {
        const tmp = tds.shift()
        tds.unshift({} as HTMLElement)
        tds.unshift(tmp as HTMLElement)
      }
      const data: Stat = {
        playerId: playerId,
        playerName: playerName,
        season: tds[0].innerText,
        competition: tds[2].querySelector("a")?.getAttribute("href") ?? "",
        club: tds[3].querySelector("a")?.getAttribute("title") ?? "",
        squad: +tds[4].innerText,
        appearences: +(tds[5].querySelector("a")?.innerText ?? 0),
        ppg: +tds[6].innerText,
        gs: +tds[7].innerText,
        ass: +tds[8].innerText,
        og: +tds[9].innerText,
        subOn: +tds[10].innerText,
        subOff: +tds[11].innerText,
        yellowCards: +tds[12].innerText,
        secondYellow: +tds[13].innerText,
        redCards: +tds[14].innerText,
        penaltyGoals: +tds[15].innerText,
        minutesPrGoal: +tds[16].innerText.replace("'", ""),
        minutesPlayed: +tds[17].innerText.replace("'", "")
      }
      return data
    })

    return dd ?? []
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
    const marketValue = await scraperMarketValue(playerId, name)
    const stats = await scrapeStats(playerId, name)
    
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
            marketValue: marketValue,
            stats: stats,
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
        marketValue: marketValue,
        stats: stats,
        transfers: transfersData,
        clubs: clubs
    } as PlayerData
}