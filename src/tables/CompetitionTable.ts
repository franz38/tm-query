import { ClubResource } from "../scapers/club";
import { CompetitionResource } from "../scapers/competition";
import { PlayerTable } from "./PlayerTable";


export class CompetitionTable {
    competitions: Promise<CompetitionResource[]>;


    constructor(ids: Promise<string[]>) {
        this.competitions = ids.then(res => res.map(id => new CompetitionResource(id)))
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
    
    getReigningChampion(): PlayerTable {

        console.log("aaaa")
        
        const getReigningChampionIds = async (tmp: Promise<CompetitionResource[]>) => {
            const outId: string[] = []
            const _comp = await tmp
            console.log("_comp.length")
            console.log(outId.length, "bbb")

            for (let i =0; i< _comp.length; i++) {
                if (!_comp[i].scraped)
                    await _comp[i].scrape()
                outId.push(_comp[i].data.currentChamp)
            }
            return outId
        }

        const ids: Promise<string[]> = getReigningChampionIds(this.competitions)
        return new PlayerTable(ids)

    }
}