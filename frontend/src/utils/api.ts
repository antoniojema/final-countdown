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

    return await readEvents()
}

async function readEvents() : Promise<boolean> {
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
    EVENTS.granada = {}
    EVENTS.columbus = {}
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

async function createEvent(city : string, day : string, title : string, description : string) : Promise<boolean> {
    const pwd = getPwd()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Origin", "*");

    const raw: string = JSON.stringify({
        "pass": pwd,
        "city": city,
        "date": day,
        "event": {
            "title": title,
            "description": description
        }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    const res = await window.fetch("https://backend.alwaysdata.net/create", requestOptions)

    return res.status === 200
}

async function updateEvent(id : number, title : string, description : string) : Promise<boolean> {
    const pwd = getPwd()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Origin", "*");

    const raw: string = JSON.stringify({
        "pass": pwd,
        "id": id,
        "event": {
            "title": title,
            "description": description
        }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    const res = await window.fetch("https://backend.alwaysdata.net/update", requestOptions)

    return res.status === 200
}

async function deleteEvent(id : number) : Promise<boolean> {
    const pwd = getPwd()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Origin", "*");

    const raw: string = JSON.stringify({
        "pass": pwd,
        "id": id
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    const res = await window.fetch("https://backend.alwaysdata.net/delete", requestOptions)

    return res.status === 200
}

export {
    readEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    isAuth,
}