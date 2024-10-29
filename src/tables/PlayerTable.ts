import { MarketValue, PlayerData, PlayerResource, Stat } from "../scapers/player";
import { objToCsv, objToCsvHeader } from "../utils/objToCsv";
import { ClubTable } from "./ClubTable";
import { ITable } from "./ITable";

export class PlayerTable implements ITable<PlayerResource, PlayerData> {
    data: Promise<PlayerResource[]>;
  
    constructor(ids: Promise<string[]>) {
        this.data = ids.then(res => res.map(id => new PlayerResource(id)))
    }

    count(): Promise<number> {
        return this.data.then(res => res.length)
    }
  
    getClubs(season?: number): ClubTable {

        const getIds = async () => {
            const outId: string[] = []
            const _players = await this.data

            for (let i=0; i<_players.length; i++) {
                if (!_players[i].scraped)
                    await _players[i].scrape()
                Object.values(_players[i].data.clubs).map(id => outId.push(id))
            }

            return outId
        }
        
        const ids: Promise<string[]> = getIds()
        return new ClubTable(ids);
    }

    async getTransfers() {

    }

    async getMarketValue(): Promise<MarketValue[]> {
        const tmp = await this.data.then(res => Promise.all(res.flatMap(pr => pr.getMarketValue())))
        return tmp.flatMap(v => v)
    }

    async getMarketValueCSV(): Promise<string> {
        const header = "playerName, mv, date, age, club, playerId\n"
        
        return header + (await this.getMarketValue())
            .map(mv => `${mv.playerName}, ${mv.mv}, ${mv.date}, ${mv.age}, ${mv.club}, ${mv.playerId}`)
            .join("\n")
    }
  
    async getCsv(): Promise<string> {
        const _ids: string[] = (await this.data).map(p => p.id)
        const promises = _ids.map(pId => new PlayerResource(pId)).map(async (t) => await t.csv());
        const tt = await Promise.all(promises);
        const res = `name, birthday, place of birt, citizenship, position, foot, id\n${tt.join(
            "\n"
        )}`;
    
        return res;
    }

    async getStats(): Promise<Stat[]> {
        const tmp = await this.data.then(res => Promise.all(res.map(async pr => await pr.getStats())))
        return tmp.flatMap(v => v)
    }

    async getStatsCSV(): Promise<string> {
        const stats = await this.getStats()
        const header = objToCsvHeader(stats[0])
        return header + stats
            .map(stat => objToCsv(stat))
            .join("\n")
    }

    async getData(): Promise<PlayerData[]> {
        return this.data.then(res => res.map(x => x.data))
    }
    
    async getId(): Promise<string[]> {
        return this.data.then(res => res.map(p => p.id))
    }
  
    //   value(): number[] {
    //     return this.players.map((pl) => pl.values[0]);
    //   }
  }