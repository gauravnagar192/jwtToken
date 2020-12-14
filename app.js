const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

app.get('/api', (req, res) => {
    res.json({
        message: 'welcome to the api'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'post created',
                authData
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'gaurav',
        email: 'gaurav@gmail.com'
    }

    jwt.sign({user}, 'secretkey' ,(err, token) => {
        res.json({
            token
        })
    })
})

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get Auth Header Value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        let bearer = bearerHeader.split(' ');
        // Get token from array
        let bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403)
    }
}

app.listen(port, ()=> {
    console.log(`server is running at port ${port}`);
})