import { Query } from "./query"


// const jp_csv = await Query.searchClub("juventus").getPlayers().csv()
// console.log(jp_csv)

// const tms = await Query.searchClub("juventus").getPlayers("1985").csv()
// console.log(tms)

const teams = await Query.searchPlayer("cassano").getClubs().csv()
console.log(teams)

// const comp = Query.getCompetition("/mlstm/startseite/wettbewerb/MLS1").getReigningChampion().csv()
// console.log(await comp)

// const ct = await Query.searchClub("juventus")
// const pt = await ct.getPlayers()
// const csv = await pt.csv()
// // const pl1 = await (await (await Query.searchClub("juventus")).getPlayers()).csv()

// // const bb = Query.searchClub("ajax")

// console.log(await ct.csv())
// console.log("\n\n")
// console.log(csv)


// class Player {
//     getClubs(): Club {
//         return new Club()
//     }
// }

// class Club {
//     getPlayers(): Player {
//         return new Player()
//     }
// }

// class Competition {

// }

