const express = require('express')
const https = require('https')
const app = express()

const API_KEY     = process.env.ROBLOX_API_KEY
const UNIVERSE_ID = process.env.UNIVERSE_ID
const PLACE_ID    = process.env.PLACE_ID

let latestVersion = 0

function checkRobloxVersion() {
    const options = {
        hostname: 'apis.roblox.com',
        path: `/cloud/v2/universes/${UNIVERSE_ID}/places/${PLACE_ID}/versions?limit=1`,
        method: 'GET',
        headers: {
            'x-api-key': API_KEY
        }
    }

    https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
            console.log("Roblox API response:", data)
            try {
                const json = JSON.parse(data)
                const versions = json.placeVersions || json.versions
                if (versions && versions[0]) {
                    const v = versions[0].versionNumber
                    if (v && v > latestVersion) {
                        latestVersion = v
                        console.log("New version:", v)
                    }
                }
            } catch(e) {
                console.log("Parse error:", e.message)
            }
        })
    }).on('error', e => console.log("Error:", e.message)).end()
}

checkRobloxVersion()
setInterval(checkRobloxVersion, 30 * 1000)

app.get('/version', (req, res) => {
    res.json({ latest: latestVersion })
})

app.listen(process.env.PORT || 3000, () => console.log("Running!"))
