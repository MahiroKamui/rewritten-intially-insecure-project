import express from 'express'
import session from 'express-session'
import cors from 'cors'
import users from './routes/users.ts'
import auth from './routes/auth.ts'
import { rateLimit } from 'express-rate-limit'



const app = express()
const port = 3000

// allow server to read json directly
app.use(express.json())

app.use(
    session({
        secret: "4rniernufgi9494457@@£€skew2£",
        resave: false,
        saveUninitialized: false,
    }),
)

app.use(cors({
    origin: "http://localhost:3002",
    credentials: true,
}))


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 3,
    standardHeaders: true,
})

app.use(limiter)

app.get('/', (req, res) => {
    res.send("Cybersecurity API")
})

app.use('/users', users)
app.use('/auth', auth)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})