import { Router } from 'express'
import bcrypt from 'bcrypt'
import db from '../database.ts'
import { requireAuth } from '../middleware.ts'
import { rateLimit } from "express-rate-limit"


const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5,
    standardHeaders: true,
})

const router = Router()

router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare(`
        SELECT * FROM users WHERE id = ?
    `).get(req.session.userId)

    res.json(user)
})

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" })
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Add user to DB
    const result = db
        .prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
      RETURNING *
    `)
        .get(username, email, hashedPassword)

    // Return user
    res.status(201).json(result)
})



router.post("/login", limiter, async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" })
    }

    const user = db
        .prepare(`
    SELECT * FROM users WHERE email = ?
    `)
        .get(email)

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    req.session.userId = user.id

    res.json(user)
})

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(204).end()
    })
})

export default router