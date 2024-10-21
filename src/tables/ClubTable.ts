import { ClubResource } from "../scapers/clubResource";
import { PlayerTable } from "./PlayerTable";

export class ClubTable {
    clubs: Promise<ClubResource[]>;
  
    constructor(ids: Promise<string[]>) {
      this.clubs = ids.then(res => res.map(id => new ClubResource(id)))
    }
  
    getPlayers(season?: string): PlayerTable {
      
      const getIds = async (_cids: Promise<ClubResource[]>) => {
        const _clubsIds: string[] = (await _cids).map(c => c.id)

        const ids: string[] = [];
        for (let i=0; i<_clubsIds.length; i++) {
            const clubb = new ClubResource(_clubsIds[i])
            if (!clubb.scraped)
                await clubb.scrape(season)
            clubb.data.players.forEach(p => ids.push(p))
        }
        return ids
      }

      const ids: Promise<string[]> = getIds(this.clubs)
      return new PlayerTable(ids);
    }
  
    async csv(): Promise<string> {
      const promises = (await this.clubs).map(async (t) => await t.csv());
      const tt = await Promise.all(promises);
      const res = `name, squadSize, avgAge, foreigners, nationalPlayers, stadium\n${tt.join(
        "\n"
      )}`;
  
      return res;
    }
  }