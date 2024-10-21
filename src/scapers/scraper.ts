import {HTMLElement} from "node-html-parser";
import { PlayerData, scrapePlayer } from "./playerResource";

export class Scaper {

    static _instance: Scaper
    scraped: {[id: string]: PlayerData}

    constructor() {
        if (!Scaper._instance)
            Scaper._instance = this
        return Scaper._instance
    }

    async scrapePlayer(id: string): Promise<PlayerData> {
        if (! (id in this.scraped))
            this.scraped[id] = await scrapePlayer(id)
            
        return this.scraped[id]
    }
    
}