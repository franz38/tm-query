import { ClubTable } from "./tables/ClubTable";
import { PlayerTable } from "./tables/PlayerTable";
import { CompetitionTable } from "./tables/CompetitionTable";
import { search } from "./utils/search";

export class TMQuery {
  static getPlayer(id: string): PlayerTable {
    return new PlayerTable(new Promise((res) => res([id])));
  }

  static getClub(id: string): ClubTable {
    return new ClubTable(new Promise((res) => res([id])));
  }

  static getCompetition(id: string): CompetitionTable {
    return new CompetitionTable(new Promise((res) => res([id])));
  }

  static searchClub(query: string): ClubTable {
    const id = search(query, "club")
    return new ClubTable(id);
  }

  static searchPlayer(query: string): PlayerTable {
    const id = search(query, "players")
    return new PlayerTable(id);
  }

  static searchCompetition(query: string): CompetitionTable {
    const id = search(query, "competitions")
    return new CompetitionTable(id)
  }

}
