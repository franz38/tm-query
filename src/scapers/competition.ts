import {parse, HTMLElement} from "node-html-parser";
import { getBox } from "../utils/getBox";
import { Scrapable } from "./resource";
import { getHeadInfo } from "../utils/getHeadInfo";
import { Scaper } from "./scraper";


export interface CompetitionData {
    numberOfTeams: string;
    players: number;
    foreigners: number;
    avgMarketvalue: string;
    avgAge: number;
    mvp: string;
    totalMarketValue: string;
    nation: string;
    tier: string;
    currentChamp: string;
    recordHolding: string; // to implement make it query -able
    clubs: string[]
}

export class CompetitionResource implements Scrapable {

    id: string;
    scraped: boolean = false;

    data: CompetitionData;

    constructor(id: string) {
        this.id = id
    }

    async scrape(season?: string): Promise<void> {
        this.data = await Scaper.getInstance().scrapeCompetition(this.id, season)
        this.scraped = true
    }

}


export const scrapeCompetition = async (competitionId: string, season?: string): Promise<CompetitionData> => {

    const seasonParam = season ? `/saison_id/${season}` : ""
    const url = `https://www.transfermarkt.com${competitionId}${seasonParam}`

    const res = await fetch(url);
    const soup = await res.text();
    const root = parse(soup);

    const box = getBox(root, "clubs")
    const rows = box.querySelector("table.items")?.querySelector("tbody")?.querySelectorAll("tr")
    const clubsIds = rows?.map(row => row.querySelectorAll("td")[1].querySelector("a")?.getAttribute("href")) as string[]

    const info = getHeadInfo(root)
    const totalMarketValueBox = root.querySelector(".data-header__market-value-wrapper")
    totalMarketValueBox?.querySelector(".data-header__last-update")?.remove()
    const totalMarketValue = totalMarketValueBox?.innerText.trim() ?? ""

    const nation = root.querySelector(".data-header__box--big")
        ?.querySelector("span.data-header__club")
        ?.querySelector("a")?.getAttribute("href") ?? ""
    const moreInfo = root.querySelector(".data-header__box--big")
        ?.querySelectorAll("span.data-header__label")
        .map(span => span.querySelector("span") as HTMLElement)
        .map(span => {
            if (span.querySelector("a"))
                return span.querySelector("a")?.getAttribute("href")
            return span.innerText
        })
        .map(s => s?.trim()) as string[]

    return {
        clubs: clubsIds,
        numberOfTeams: info[0],
        players: +info[1],
        foreigners: +(info[2].replace(/\D/g, "")),
        avgMarketvalue: info[3],
        avgAge: +info[4],
        mvp: info[5],
        nation: nation,
        tier: moreInfo[0],
        currentChamp: moreInfo[1],
        recordHolding: moreInfo[2],
        totalMarketValue: totalMarketValue
    }
}