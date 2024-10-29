
export const objToCsv = (obj: any): string => {
    return Object.values(obj).join(", ")
}

export const objToCsvHeader = (obj: any): string => {
    return Object.keys(obj).join(", ")
}