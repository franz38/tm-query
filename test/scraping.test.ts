import { expect, test } from "vitest";
import { TMQuery } from "../src/query";


test("scrape club base data", async () => {
  const club1 = await TMQuery.getClub("/manchester-city/startseite/verein/281").getCsv()
  expect(club1).toBe("name, squadSize, avgAge, foreigners, nationalPlayers, stadium\nManchester City, 24, 27.7, 16, 19, Etihad Stadium")
  
  const club2 = await TMQuery.getClub("/juventus-fc/startseite/verein/506").getCsv()
  expect(club2).toBe("name, squadSize, avgAge, foreigners, nationalPlayers, stadium\nJuventus FC, 27, 25.8, 19, 18, Allianz Stadium")

  const club3 = await TMQuery.getClub("/fc-barcelona/startseite/verein/131").getCsv()
  expect(club3).toBe("name, squadSize, avgAge, foreigners, nationalPlayers, stadium\nFC Barcelona, 26, 24.6, 8, 14, Olímpic Lluís Companys")
});

test("scrape player base data", async () => {
  const player1 = await TMQuery.getPlayer("/gavi/profil/spieler/646740").getCsv()
  expect(player1).toBe("name, birthday, place of birt, citizenship, position, foot, id\nGavi, Aug 5, 2004 (20), Spain, Spain, Midfield - Central Midfield, right, /gavi/profil/spieler/646740")
  
  const player2 = await TMQuery.getPlayer("/antoine-mendy/profil/spieler/891998").getCsv()
  expect(player2).toBe("name, birthday, place of birt, citizenship, position, foot, id\nAntoine Mendy, May 27, 2004 (20), France, France, Senegal, Defender - Right-Back, right, /antoine-mendy/profil/spieler/891998")
  
  const player3 = await TMQuery.getPlayer("/saul-coco/profil/spieler/588426").getCsv()
  expect(player3).toBe("name, birthday, place of birt, citizenship, position, foot, id\nSaúl Coco, Feb 9, 1999 (25), Spain, Equatorial Guinea, Spain, Defender - Centre-Back, right, /saul-coco/profil/spieler/588426")
});
