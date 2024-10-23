import { expect, test } from "vitest";
import { TMQuery } from "../../src/query";


test("search clubs", async () => {
    const id1 = await TMQuery.searchClub("juventus").getId();
    expect(id1[0]).toBe("/juventus-turin/startseite/verein/506");

    const id2 = await TMQuery.searchClub("ajax").getId();
    expect(id2[0]).toBe("/ajax-amsterdam/startseite/verein/610");

    const id3 = await TMQuery.searchClub("inter").getId();
    expect(id3[0]).toBe("/inter-mailand/startseite/verein/46");
});

test("search player", async () => {
    const id1 = await TMQuery.searchPlayer("insigne").getId();
    expect(id1[0]).toBe("/lorenzo-insigne/profil/spieler/133964");
});

test("search competitions", async () => {
    const id1 = await TMQuery.searchCompetition("serie a").getId();
    expect(id1[0]).toBe("/serie-a/startseite/wettbewerb/IT1");
});