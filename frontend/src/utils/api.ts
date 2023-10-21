const PWD_KEY = 'pwd'

function getPwd () {
    return localStorage.getItem(PWD_KEY)
}

async function isAuth() {
    const pwd = getPwd()
    if (!pwd) {
        return false
    }

    const result = await read()
    console.log('LOGIN RES', result)
    return result.status === 200
}

async function read() {
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

    return window.fetch("http://backend.alwaysdata.net/read", requestOptions)
}

export {
    read,
    isAuth,
}