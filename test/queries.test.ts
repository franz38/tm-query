import { expect, test } from "vitest";
import { TMQuery } from "../src/query";


test('search "barcelona"', async () => {
  const players = await TMQuery.searchClub("barcelona").getCsv();
  expect(players.split("\n")[0]).toBe(
    "name, squadSize, avgAge, foreigners, nationalPlayers, stadium"
  );
  expect(players.split("\n")[1]).toBe(
    "FC Barcelona, 26, 24.6, 8, 14, Olímpic Lluís Companys"
  );
  expect(players.split("\n").length).toBe(2);
});

test('search "juventus" and get players from 1985', async () => {
  const players = await TMQuery.searchClub("juventus")
    .getPlayers("1985")
    .getCsv();
  expect(players.split("\n")[0]).toBe(
    "name, birthday, place of birt, citizenship, position, foot, id"
  );
  expect(players.split("\n")[1]).toBe(
    "Stefano Tacconi, May 13, 1957 (67), Italy, Italy, Goalkeeper, right, /stefano-tacconi/profil/spieler/118257"
  );
  expect(players.split("\n")[11]).toBe(
    "Aldo Dolcetti, Oct 23, 1966 (58), Italy, Italy, Midfield, Retired, /aldo-dolcetti/profil/spieler/226443"
  );
  expect(players.split("\n").length).toBe(21);
}, {timeout: 30000});

test('search "eden hazard"', async () => {
  const player = await TMQuery.searchPlayer("hazard").getCsv();
  expect(player.split("\n")[0]).toBe(
    "name, birthday, place of birt, citizenship, position, foot, id"
  );
  expect(player.split("\n")[1]).toBe(
    "Eden Hazard, Jan 7, 1991 (33), Belgium, Belgium, Attack - Left Winger, right, /eden-hazard/profil/spieler/50202"
  );
  expect(player.split("\n").length).toBe(2);
});

test('search "Lewandowski" and get former clubs', async () => {
    const clubs = await TMQuery.searchPlayer("Lewandowski").getClubs().getCsv()
    expect(clubs.split("\n")[0]).toBe(
        "name, squadSize, avgAge, foreigners, nationalPlayers, stadium"
    )
    expect(clubs.split("\n")[1]).toBe(
        "Bayern Munich, 28, 26.5, 17, 20, Allianz Arena"
    )
});

test("search hazard and get list of clubs he played for", async () => {
  const clubs = await TMQuery.searchPlayer("eden hazard").getClubs().getCsv();
  expect(clubs.split("\n")[0]).toBe(
    "name, squadSize, avgAge, foreigners, nationalPlayers, stadium"
  );
  expect(clubs.split("\n")[1]).toBe(
    "Real Madrid, 22, 27.1, 17, 17, Santiago Bernabéu"
  );
  expect(clubs.split("\n")[2]).toBe(
    "Chelsea FC, 29, 24.1, 19, 16, Stamford Bridge"
  );
});

test('count all seria a players (season 00/01)', async () => {
    const n = await TMQuery.searchCompetition("serie a")
        .getClubs("2000")
        .getPlayers()
        .count()
    expect(n).toBe(720)
}, {timeout: 30000})

test('search player and get his market values', async () => {
    const mvs = await TMQuery.searchPlayer("de roon").getMarketValueCSV();
    expect(mvs.split("\n")[0]).toBe(
        "playerName, mv, date, age, club, playerId"
    )
    expect(mvs.split("\n")[1]).toBe(
        "Marten de Roon, €50k, Mar 28, 2010, 18, Sparta Rotterdam U19, /marten-de-roon/profil/spieler/133179"
    )
    expect(mvs.split("\n")[15]).toBe(
        "Marten de Roon, €10.00m, Aug 1, 2016, 25, Middlesbrough FC, /marten-de-roon/profil/spieler/133179"
    )
})