import express from 'express';
import dotenv from 'dotenv';
import posts from './database.js';
import jwt from 'jsonwebtoken';
dotenv.config();
const app = express();
app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
    res.status(200).json(posts.filter(post => post.userName === req.user.name))
})
app.post('/login', (req, res) => {
    // authenticate user
    const userName = req.body.userName
    const payload = { name: userName };
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET)
    res.json({ accessToken: accessToken });
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_SECRET, (err, payload) => {
        if (err) return res.status(403).json("Token not verified")
        req.user = payload
        next()
    })
}
app.listen(process.env.PORT, () => {
    console.log(`Server is up and running @${process.env.PORT}`)
})