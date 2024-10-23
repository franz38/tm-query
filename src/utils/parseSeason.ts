
export const parseSeason = (raw_season: string): number => {

    if (+raw_season)
        return +raw_season

    if (raw_season.includes("/"))
        return parseSeason(raw_season.split("/")[0])

    if (raw_season.includes("-"))
        return parseSeason(raw_season.split("-")[0])

    throw new Error("Season format is not correct")
}