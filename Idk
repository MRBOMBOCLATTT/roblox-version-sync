const express = require('express')
const app = express()
app.use(express.json())

let latestVersion = 0
const SECRET = "EFF_KEY_SECRET_VERY_SECRET"

app.post('/update', (req, res) => {
    if (req.headers['x-secret'] !== SECRET) {
        return res.status(403).json({ error: "forbidden" })
    }
    const v = parseInt(req.body.version)
    if (!isNaN(v) && v > latestVersion) {
        latestVersion = v
        console.log("New latest version:", v)
    }
    res.json({ ok: true })
})

app.get('/version', (req, res) => {
    res.json({ latest: latestVersion })
})

app.listen(process.env.PORT || 3000, () => console.log("Running!"))
