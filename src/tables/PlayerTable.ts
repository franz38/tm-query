import { PlayerResource } from "../scapers/playerResource";
import { ClubTable } from "./ClubTable";

export class PlayerTable {
    players: Promise<PlayerResource[]>;
  
    constructor(ids: Promise<string[]>) {
        console.log("pt")
      this.players = ids.then(res => res.map(id => new PlayerResource(id)))
    }
  
    getClubs(season?: number): ClubTable {

        const getIds = async () => {
            const outId: string[] = []
            const _players = await this.players

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
  
    async csv(): Promise<string> {
        const _ids: string[] = (await this.players).map(p => p.id)
        const promises = _ids.map(pId => new PlayerResource(pId)).map(async (t) => await t.csv());
        const tt = await Promise.all(promises);
        const res = `name, birthday, place of birt, citizenship, position, foot, id\n${tt.join(
            "\n"
        )}`;

        console.log("zzzz")
    
        return res;
    }
  
    //   value(): number[] {
    //     return this.players.map((pl) => pl.values[0]);
    //   }
  }