import {cities} from "./constants"
import {DayEvent, CityEvents} from "./types"

const PWD_KEY = 'pwd'

export const EVENTS : { [key : string]: CityEvents; } = {
    [cities.granada]: {},
    [cities.columbus] : {},
}

function getPwd () {
    return localStorage.getItem(PWD_KEY)
}

async function isAuth() : Promise<boolean> {
    const pwd = getPwd()
    if (!pwd) {
        return false
    }

    return await read()
}

async function read() : Promise<boolean> {
    const pwd = getPwd()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Origin", "*");

    const raw: string = JSON.stringify({
    "pass": pwd
    });

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    };

    const res = await window.fetch("https://backend.alwaysdata.net/read", requestOptions)

    if (res.status !== 200) {
        return false;
    }

    const events = (await res.json())["events"]
    for (const e of events) {
        const city = e["city"]
        const date = e["date"]
        const title = e["title"]
        const description = e["description"]
        const id = e["id"]

        EVENTS[city][date] = EVENTS[city][date] || []
        EVENTS[city][date].push({title, description, id})
    }

    return true;
}

export {
    read,
    isAuth,
}