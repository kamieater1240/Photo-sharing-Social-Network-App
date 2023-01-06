// import express
const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// import and enable cors
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// create an instance of express app
const app = express();
const postsRouter = require('./posts');
const authRouter = require('./auth');
const commentsRouter = require('./comments');
const usersRouter = require('./users');
const followsRouter = require('./follows');
const uploadModule = require('./upload');
const uploadRouter = uploadModule.router;
const likeRouter = require('./like');
const visibilityRouter = require('./visibility');
const oneDay = 60 * 60 * 24 * 1000;
const oneMinute = 60 * 1000
// configure express to parse bodies
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const cors = require("cors");
// var corsOptions = {
//     origin: "http://localhost:3000"
// };
// app.use(cors(corsOptions));

// enable cors

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:8080'],
    credentials : true
}))
app.set('trust proxy', 1)
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://kycjosh:557@cluster0.wad7swc.mongodb.net/?retryWrites=true&w=majority', //YOUR MONGODB URL
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
    secret: 'abcdedfghijklmno',
    resave : false,
    cookie: {
        secure : false,
        // httpOnly : true,
        maxAge: oneDay
    },
    saveUninitialized: true
}))
app.get('/', (req, res) => {
    res.send('Test Method');
})
app.use('/auth', authRouter);
app.all("*", (req,res, next) => {
    if(req.headers['version'] === 'test') {
        next();
    } else if(req.session && req.session.authenticated && (Date.now() < new Date(req.session.cookie._expires).getTime() )) {
        console.log("Session is valid", req.session);
        next();
    } else {
        console.log("Expired Session" , req.session)
        res.status(401).send({"message" : "Expired Session"});
    }
})
app.use('/post', postsRouter);
app.use('/comment', commentsRouter);
app.use('/user', usersRouter);
app.use('/follow', followsRouter);
app.use('/upload', uploadRouter);
app.use('/like', likeRouter);
app.use('/visibility', visibilityRouter);

module.exports = app;