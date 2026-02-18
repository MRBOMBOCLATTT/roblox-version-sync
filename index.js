const express = require('express')
const https = require('https')
const app = express()
app.use(express.json())

const SECRET   = "EFF_KEY_SECRET_VERY_SECRET"
const PLACE_ID = "131774970380479"

let latestVersion = 0

function checkRobloxVersion() {
    https.get(`https://develop.roblox.com/v1/places/${PLACE_ID}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
            try {
                const json = JSON.parse(data)
                const v = json.currentPublishedVersion
                if (v && v > latestVersion) {
                    latestVersion = v
                    console.log("New version from Roblox API:", v)
                }
            } catch(e) {
                console.log("Parse error:", e.message)
            }
        })
    }).on('error', e => console.log("Roblox API error:", e.message))
}

checkRobloxVersion()
setInterval(checkRobloxVersion, 30 * 1000)

app.get('/version', (req, res) => {
    res.json({ latest: latestVersion })
})

app.listen(process.env.PORT || 3000, () => console.log("Running!"))
