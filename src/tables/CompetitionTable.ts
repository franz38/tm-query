import { CompetitionData, CompetitionResource } from "../scapers/competition";
import { parseSeason } from "../utils/parseSeason";
import { ClubTable } from "./ClubTable";
import { ITable } from "./ITable";


export class CompetitionTable implements ITable<CompetitionResource, CompetitionData> {
    data: Promise<CompetitionResource[]>;

    constructor(ids: Promise<string[]>) {
        this.data = ids.then(res => res.map(id => new CompetitionResource(id)))
    }
    count(): Promise<number> {
        return this.data.then(res => res.length)
    }
    getCsv(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getId(): Promise<string[]> {
        return this.data.then(res => res.map(p => p.id))
    }
    getData(): Promise<CompetitionData[]> {
        throw new Error("Method not implemented.");
    }

    // getPlayers(season?: string): PlayerTable {
      
    //     const getIds = async (_cids: Promise<ClubResource[]>) => {
    //       const _clubsIds: string[] = (await _cids).map(c => c.id)
  
    //       const ids: string[] = [];
    //       for (let i=0; i<_clubsIds.length; i++) {
    //           const clubb = new ClubResource(_clubsIds[i])
    //           if (!clubb.scraped)
    //               await clubb.scrape(season)
    //           clubb.data.players.forEach(p => ids.push(p))
    //       }
    //       return ids
    //     }
  
    //     const ids: Promise<string[]> = getIds(this.clubs)
    //     return new PlayerTable(ids);
    //   }
    
    getReigningChampion(): ClubTable {
        
        const getReigningChampionIds = async () => {
            const outId: string[] = []
            const _comp = await this.data

            for (let i =0; i< _comp.length; i++) {
                if (!_comp[i].scraped)
                    await _comp[i].scrape()
                outId.push(_comp[i].data.currentChamp)
            }

            return outId
        }

        const ids: Promise<string[]> = getReigningChampionIds()
        return new ClubTable(ids)

    }

    getClubs(season?: string): ClubTable {
        const _season = parseSeason(season)

        const getIds = async () => {
            const outId: string[] = []
            const _comp = await this.data

            for (let i=0; i<_comp.length; i++) {
                if (!_comp[i].scraped)
                    await _comp[i].scrape(_season)
                Object.values(_comp[i].data.clubs).map(id => outId.push(id))
            }

            return outId
        }
        
        const ids: Promise<string[]> = getIds()
        return new ClubTable(ids);
    }
}