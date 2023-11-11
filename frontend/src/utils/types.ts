export type TimeInfo = { UTCSummerOffset: number, summerToWinter: Date }

export type DayEvent = {
    title: string,
    description: string, 
    id : number
}

export type CityEvents = { [key: string]: DayEvent[]; }
