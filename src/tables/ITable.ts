
export interface ITable<R,T> {
    data: Promise<R[]>,
    getCsv(): Promise<string>,
    getId(): Promise<string[]>
    getData(): Promise<T[]>
}