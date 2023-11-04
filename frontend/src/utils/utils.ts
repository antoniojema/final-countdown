import { DayEvent, TimeInfo } from "./types"
import { EVENTS } from "./api"

export function formatUTCDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2,"0")
    const month = (date.getUTCMonth()+1).toString().padStart(2,"0")
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
}

export function formatUTCTime(date: Date): string {
    const hour = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")
    const seconds = date.getUTCSeconds().toString().padStart(2, "0")
    return `${hour}:${minutes}:${seconds}`

}

export function getLocalDate(timeInfo: TimeInfo) {
    const now = new Date()
    const offset = (now > timeInfo.summerToWinter)
        ? timeInfo.UTCSummerOffset - 1
        : timeInfo.UTCSummerOffset
    now.setTime(now.getTime() + offset * 60 * 60 * 1000)
    return `${formatUTCDate(now)}`
}

export function getLocalTime(timeInfo: TimeInfo) {
    const now = new Date()
    const offset = (now > timeInfo.summerToWinter)
        ? timeInfo.UTCSummerOffset - 1
        : timeInfo.UTCSummerOffset
    now.setTime(now.getTime() + offset * 60 * 60 * 1000)
    return `${formatUTCTime(now)}`
}

export function getLocalDateAndTime(timeInfo: TimeInfo) {
    return `${getLocalDate(timeInfo)} ${getLocalTime(timeInfo)}`
}

export function getDayEvents(city: string, date: Date): DayEvent[] {
    return EVENTS[city][formatUTCDate(date)] || []
}

export function setDayEvent(city: string, date: Date, event: string) {
    const key =  `${city}+${date}`
    localStorage.setItem(key, event)
}

export function getCityDateId(city: string, date: Date) {
    return `${city}_${formatUTCDate(date).replaceAll('/', '_')}`
}
