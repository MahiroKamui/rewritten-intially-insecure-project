import express from 'express'
import session from 'express-session'
import cors from 'cors'
import users from './routes/users.ts'
import auth from './routes/auth.ts'



const app = express()
const port = 3000

// allow server to read json directly
app.use(express.json())

app.use(
    session({
        secret: "4rniernufgi9494457@@£€sskkw2£",
        resave: false,
        saveUninitialized: false,
    }),
)

app.use(cors({
    origin: "http://localhost:3002",
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send("Cybersecurity API")
})

app.use('/users')
app.use('/auth')

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})