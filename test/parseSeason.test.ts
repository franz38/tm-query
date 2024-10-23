import { expect, test } from "vitest";
import { parseSeason } from "../src/utils/parseSeason";


test("season decoding", () => {
    expect(parseSeason("2022")).toBe(2022)
    expect(parseSeason("1912")).toBe(1912)
    expect(parseSeason("2022/2023")).toBe(2022)
    expect(parseSeason("2000-2001")).toBe(2000)
})