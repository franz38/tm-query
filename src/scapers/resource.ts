

export interface Scrapable {
    id: string;
    scraped: boolean;

    scrape(): Promise<void>
}