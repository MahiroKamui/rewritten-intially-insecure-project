import { Router } from 'express'
import db from '../database.ts'
import { requireAuth } from '../middleware.ts'


const router = Router()

router.get("/", requireAuth, (_req, res) => {
    const users = db.prepare("SELECT id, username, email FROM users").all()

    res.json(users)
})

router.get("/search", requireAuth, (req, res) => {
    const name = req.query.name

    if (!name) {
        return res.status(400).json({ error: "Name is required" })
    }

    const users = db
        .prepare(`SELECT id, username, email FROM users WHERE username LIKE ?`)
        .all(`'%${name}%'`)

    res.json(users)
})

router.get("/:id", requireAuth, (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid id" })
    }

    const user = db.prepare("SELECT id, username, email FROM users WHERE id = ?").get(id)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
})

export default router