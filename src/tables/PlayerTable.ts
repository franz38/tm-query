import { PlayerData, PlayerResource } from "../scapers/playerResource";
import { ClubTable } from "./ClubTable";
import { ITable } from "./ITable";

export class PlayerTable implements ITable<PlayerResource, PlayerData> {
    data: Promise<PlayerResource[]>;
  
    constructor(ids: Promise<string[]>) {
        this.data = ids.then(res => res.map(id => new PlayerResource(id)))
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
  
    async getCsv(): Promise<string> {
        const _ids: string[] = (await this.data).map(p => p.id)
        const promises = _ids.map(pId => new PlayerResource(pId)).map(async (t) => await t.csv());
        const tt = await Promise.all(promises);
        const res = `name, birthday, place of birt, citizenship, position, foot, id\n${tt.join(
            "\n"
        )}`;

        console.log("zzzz")
    
        return res;
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