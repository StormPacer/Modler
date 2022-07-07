const fs = require("fs")
const unzipper = require("unzipper")
const request = require("request")
const fetch = require("node-fetch")
const protocol = require("protocol-registry")
const wait = require("wait")

async function Modler() {

    try {
        fs.readFileSync(`${process.env.APPDATA}\\modler\\protocol`)

        try {

            async function getCustomPath() {
                try {
                    const dir = String(fs.readFileSync(`${process.env.APPDATA}\\modler\\customDirectory.txt`))
                    return new Promise((resolve, reject) => {
                        return resolve(dir)
                    })
                } catch (err) {
                    return new Promise((resolve, reject) => {
                        return resolve(undefined)
                    })
                }
            }

            async function getSteamPath() {
                try {
                    fs.readdirSync(`${process.env.ProgramFiles} (x86)\\Steam\\steamapps\\common\\Beat Saber`)
                    return new Promise((resolve, reject) => {
                        return resolve(`${process.env.ProgramFiles} (x86)\\Steam\\steamapps\\common\\Beat Saber`)
                    })
                } catch (err) {
                    return new Promise((resolve, reject) => {
                        return resolve(undefined)
                    })
                }
            }

            async function getOculusPath() {
                try {
                    fs.readdirSync(`${process.env.ProgramFiles}\\Oculus\\Software\\Software\\hyperbolic-magnetism-beat-saber`)
                    return new Promise((resolve, reject) => {
                        return resolve(`${process.env.ProgramFiles}\\Oculus\\Software\\Software\\hyperbolic-magnetism-beat-saber`)
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
                        console.log(`Custom directory detected!\nPlease paste the path to your custom Beat Saber directory in the "customDirectory.txt" file in the following folder: ${process.env.APPDATA}\\modler.\n\nYou can copy paste the path to AppData in your windows search bar!`)
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

                if (peepo.length == 0) {
                    console.log("No mod found!")
                    return
                }

                file = peepo[0].assets[0].name
                fileLink = peepo[0].assets[0].browser_download_url
            }

            else if (!GHDATA.message) {
                file = GHDATA.assets[0].name
                fileLink = GHDATA.assets[0].browser_download_url
            }

            try {
                fs.readdirSync(`${path}\\IPA\\Pending`)
            }
            catch (err) {
                console.log("Made pending folder.")
                fs.mkdirSync(`${path}\\IPA\\Pending`)
            }
            try {
                fs.readdirSync(`${path}\\IPA\\Pending\\Plugins`)
            } catch (err) {
                console.log("Made plugins folder.")
                fs.mkdirSync(`${path}\\IPA\\Pending\\Plugins`)
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
                            .pipe(fs.createWriteStream(`${path}\\IPA\\Pending\\mod.zip`))

                            .on("close", () => {
                                console.log("Downloaded the mod zip. Waiting to extract the mod.")
                                ExtractZip()
                            })
                    }

                    await getZip(`${file}`, `${fileLink}`)
                }

                function ExtractZip() {

                    fs.createReadStream(`${path}\\IPA\\Pending\\mod.zip`).pipe(unzipper.Extract({ path: `${path}\\IPA\\Pending` }))
                        .on("close", () => {
                            console.log("Installed the mod.")
                            fs.unlinkSync(`${path}\\IPA\\Pending\\mod.zip`)
                        })

                        .on("error", (err) => {
                            console.log(err)
                        })
                }

                DownloadZip()

            }

            else if (fileLink.endsWith(".dll")) {
                function installDll(file, url) {

                    const dat = {
                        url: url,
                        method: "GET",
                        headers: {
                            "User-Agent": "StormPacer"
                        },
                        json: true
                    }

                    request.get(dat)
                        .pipe(fs.createWriteStream(`${path}\\IPA\\Pending\\Plugins\\${file}`))

                        .on("close", () => {
                            console.log("Installed the mod.")
                        })
                }

                installDll(`${file}`, `${fileLink}`)

            }

            else {
                console.log("This isn't a Beat Saber mod.")
            }
        } catch (err) {
            throw err
        }

    } catch (err) {

        console.log("Registered the protocol")
        console.log("\x1b[31m" + "Don't re-open this exe on it's own again! If you do, read the Github for instructions on what to do.")

        fs.mkdirSync(`${process.env.APPDATA}\\modler`)

        fs.writeFileSync(`${process.env.APPDATA}\\modler\\protocol`, "Oh hi, you looked at this file. This is used to check if the protocol is already registered.")

        protocol.register(
            {
                protocol: "modler",
                command: `${process.cwd()}\\modler.exe $_URL_`,
                override: true,
                terminal: true
            }
        )

        wait(15000)
    }
}

Modler()