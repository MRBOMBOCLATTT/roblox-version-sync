const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())

const SECRET = "EFF_KEY_SECRET_VERY_SECRET"
const FILE   = './version.json'

function getLatest() {
    try { return JSON.parse(fs.readFileSync(FILE)).latest || 0 }
    catch { return 0 }
}

function saveLatest(v) {
    fs.writeFileSync(FILE, JSON.stringify({ latest: v }))
}

app.post('/update', (req, res) => {
    if (req.headers['x-secret'] !== SECRET) {
        return res.status(403).json({ error: "forbidden" })
    }
    const v = parseInt(req.body.version)
    if (!isNaN(v) && v > getLatest()) {
        saveLatest(v)
        console.log("New latest version:", v)
    }
    res.json({ ok: true })
})

app.get('/version', (req, res) => {
    res.json({ latest: getLatest() })
})

app.listen(process.env.PORT || 3000, () => console.log("Running!"))
