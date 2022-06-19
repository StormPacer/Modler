const fs = require("fs")
const unzipper = require("unzipper")
const request = require("request")
const fetch = require("node-fetch")
const delay = require("delay")

async function Modler() {

    try {

        async function getCustomPath() {
            try {
                const dir = String(fs.readFileSync(`${process.env.APPDATA}\\modler\\customDirectory.txt`))
                return new Promise((resolve, reject) => {
                    return resolve(dir.replace("\\", "\\\\"))
                })
            } catch (err) {
                return new Promise((resolve, reject) => {
                    return resolve(undefined)
                })
            }
        }

        async function getSteamPath() {
            try {
                fs.readdirSync(`${process.env.ProgramFiles} (x86)\\Steam\\steamapps\\common\\Beat Saber`, (err, files) => {
                    return new Promise((resolve, reject) => {
                        return resolve(`${process.env.ProgramFiles} (x86)\\Steam\\steamapps\\common\\Beat Saber`)
                    })
                })
            } catch (err) {
                return new Promise((resolve, reject) => {
                    return resolve(undefined)
                })
            }
        }

        async function getOculusPath() {
            try {
                fs.readdirSync(`${process.env.ProgramFiles}\\Oculus\\Software\\Software\\hyperbolic-magnetism-beat-saber`, (err, files) => {
                    return new Promise((resolve, reject) => {
                        return resolve(`${process.env.ProgramFiles}\\Oculus\\Software\\Software\\hyperbolic-magnetism-beat-saber`)
                    })
                })
            } catch (err) {
                return new Promise((resolve, reject) => {
                    return resolve(undefined)
                })
            }
        }

        let path = await getCustomPath()

        if (path == undefined) {
            if (await getSteamPath() == undefined) {
                if (await getOculusPath() == undefined) {
                    fs.writeFileSync(`${process.env.APPDATA}\\modler\\customDirectory.txt`, "[Directory goes here]")
                    console.log(`Custom directory detected!\nPlease paste your custom directory in the "customDirectory.txt" file in the following directory: ${process.env.APPDATA}\\modler.\n\nYou can copy paste it in your windows search bar!`)
                    return
                }
                else {
                    path = await getOculusPath()
                }
            }
            else {
                path = await getSteamPath()
            }
        }

        const url = process.title
        const elements = url.split("\\")
        async function getModlerPlace() {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].startsWith("modler.exe")) {
                    return new Promise((resolve, reject) => {
                        resolve(i)
                    })
                }
            }
        }
        const x = await getModlerPlace()
        const head = elements[x].split("/")
        const finalArray = head.splice(2)
        const link = finalArray.join("/")

        const GHDATA = await fetch(`${link}`).then(res => res.json())

        let file
        let fileLink

        if (GHDATA.message) {
            let newLink = link.split("/")
            newLink.splice(7, 1)
            const finalLink = newLink.join("/")

            const peepo = await fetch(`${finalLink}`).then(res => res.json())
            file = peepo[0].assets[0].name
            fileLink = peepo[0].assets[0].browser_download_url
        }

        else if (!GHDATA.message) {
            file = GHDATA.assets[0].name
            fileLink = GHDATA.assets[0].browser_download_url
        }

        if (fileLink.endsWith(".zip")) {

            async function DownloadZip() {


                async function getZip(file, url) {

                    const dat = {
                        url: url,
                        method: "GET",
                        headers: {
                            "User-Agent": "StormPacer"
                        },
                        json: true
                    }

                    request.get(dat)
                        .pipe(fs.createWriteStream(`${path}\\mod.zip`))

                        .on("close", () => {
                            console.log("Downloaded the mod zip. Waiting to extract the mod.")
                            ExtractZip()
                        })
                }

                await getZip(`${file}`, `${fileLink}`)

                return new Promise((resolve, reject) => {
                    resolve()
                })
            }

            async function ExtractZip() {

                fs.createReadStream(`${path}\\mod.zip`).pipe(unzipper.Extract({ path: `${path}` }))
                    .on("close", () => {
                        console.log("Installed the mod.")
                        fs.unlinkSync(`${path}\\mod.zip`)
                    })

                    .on("error", (err) => {
                        console.log(err)
                    })
            }

            DownloadZip()

        }

        else if (fileLink.endsWith(".dll")) {
            async function installDll(file, url) {

                const dat = {
                    url: url,
                    method: "GET",
                    headers: {
                        "User-Agent": "StormPacer"
                    },
                    json: true
                }

                request.get(dat)
                    .pipe(fs.createWriteStream(`${path}\\Plugins\\${file}`))

                    .on("close", () => {
                        console.log("Installed the mod.")
                    })
            }

            await installDll(`${file}`, `${fileLink}`)

        }

        else {
            console.log("This isn't a Beat Saber mod.")
        }
    } catch (err) {
        throw err
    }
}

Modler()