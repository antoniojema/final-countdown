import { DayEvent, TimeInfo } from "./types"
import { EVENTS } from "./api"

var globalApp: React.Component | undefined = undefined

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const months_short = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const week_days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const week_days_short = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

export function formatUTCDate(date: Date, month_string : boolean = false, include_weekday : boolean = false): string {
    const day = date.getUTCDate().toString().padStart(2,"0")
    const month = month_string
        ? months_short[date.getUTCMonth()]
        : (date.getUTCMonth()+1).toString().padStart(2,"0");
    const year = date.getUTCFullYear()

    let ret = month_string
        ? `${day} ${month} ${year}`
        : `${day}/${month}/${year}`
    
    if (include_weekday) {
        const weekday = week_days_short[date.getUTCDay()]
        ret = `${weekday} ${ret}`
    }

    return ret;
}

export function formatUTCDateStrMonth(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2,"0")
    const month = months_short[date.getUTCMonth()]
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
    return `${formatUTCDate(now, true)}`
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

export function setGlobalApp(app: React.Component) {
    globalApp = app
}

export function getGlobalApp(): React.Component {
    return globalApp as React.Component
}
