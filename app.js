const express = require('express');
const database = require('mysql');
const path = require('path')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

const db = database.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'authentication'
});

let SECRET_KEY = 'testingJWT';
const app = express();

app.set('PORT', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     
    extended: true
}));


app.get("/home", (req, res) => {
    res.sendFile('homepage.html', { root: path.join(__dirname, '/public/')} )
})


app.get("/home/24h", (req, res) => {
    res.sendFile('chart.html', { root: path.join(__dirname, '/public/')} )
})

app.get("/api/infor", (req, res)=> {
    res.send({
        rooms : 3,
        devices: 3,
        deviceName: ["light", "fan", "air-condition"]
    })
})


app.get('/api/home', (req, res) => {
    res.send({
        success: true,
        data: [1,2,3]
    })
})

app.get("/api/light", (req, res) => {
    res.send({
        name: 'light',
        statusNow : "on",
        ampe: "1A",
        voltage: "220V",
        duration: 180
    })
})

app.get('/api/light/changestatus', (req, res) => {
    res.send({
        name: 'light',
        statusNow : "off",
        ampe: "0A",
        voltage: "0V",
        duration: 0
    })
})

app.get('/api/device/:id', (req, res) => {
    if ( req.params.id == '1') {
        res.send({
            id: req.params.id,
            success: true,
            data: ["light","fan"]
        })
    }
    else {
        if ( req.params.id == '2') {
            res.send({
                id: req.params.id,
                success: true,
                data: ["light","fan","air-condition"]
            })
        }
        else {
            res.send({
                id: req.params.id,
                success: true,
                data: ["fan"]
            })
        }
    }
})


app.get("/", (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '/public/')} )
})

app.get('/test', (req, res) => {
    res.sendFile(__dirname +'/public/index-test.html')
})

app.listen(app.get('PORT'));

