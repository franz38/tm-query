import { PlayerData, scrapePlayer } from "./player";
import { ClubData, scrapeClub } from "./club";
import { CompetitionData, scrapeCompetition } from "./competition";

export class Scaper {

    static _instance: Scaper
    players: {[id: string]: PlayerData}
    clubs: {[id: string]: ClubData}
    competitions: {[id: string]: CompetitionData}

    constructor() {
        this.players = {}
        this.clubs = {}
        this.competitions = {}
    }

    static getInstance(){
        if (!Scaper._instance)
            Scaper._instance = new Scaper()
        return Scaper._instance
    }

    async scrapePlayer(id: string): Promise<PlayerData> {
        if (! (id in this.players))
            this.players[id] = await scrapePlayer(id)
            
        return this.players[id]
    }

    async scrapeClub(id: string, season?: string): Promise<ClubData> {
        if (! (id in this.clubs))
            this.clubs[id] = await scrapeClub(id, season)
            
        return this.clubs[id]
    }

    async scrapeCompetition(id: string, season?: string): Promise<CompetitionData> {
        if (! (id in this.clubs))
            this.competitions[id] = await scrapeCompetition(id, season)
            
        return this.competitions[id]
    }
    
}