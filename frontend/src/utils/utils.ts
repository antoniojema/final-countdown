import { TimeInfo } from "../types"

function formatUTCDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2,"0")
    const month = (date.getUTCMonth()+1).toString().padStart(2,"0")
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
}

function formatUTCTime(date: Date): string {
    const hour = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")
    const seconds = date.getUTCSeconds().toString().padStart(2, "0")
    return `${hour}:${minutes}:${seconds}`

}



function getLocalDate(timeInfo: TimeInfo) {
    const now = new Date()
    const offset = (now > timeInfo.summerToWinter)
        ? timeInfo.UTCSummerOffset - 1
        : timeInfo.UTCSummerOffset
    now.setTime(now.getTime() + offset * 60 * 60 * 1000)
    return `${formatUTCDate(now)} ${formatUTCTime(now)}`
}

export {
    getLocalDate
}