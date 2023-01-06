const dbLib = require("./dbFunctions");
const {getConn, getDB} = require("./dbFunctions");
const express = require("express");
const router = express.Router()
const bodyParser = require('body-parser')
const uuid = require("uuid");
const jsonParser = bodyParser.json({limit: '50mb'})
// store all connected clients
var clients = {};

router.post('/profilePicture', jsonParser,async (req,res) => {
    try {
        const profilePicture = {
            userId : req.body.userId,
            profilePicture : req.body.profilePicture,
        }
        const db = await getDB();
        if(await dbLib.uploadProfilePicture(db, profilePicture)) {
            console.log("Upload Profile Picture Successful");
            res.status(201).send({
                "message" : "Profile Picture updated successfully"
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message})
    }
})

router.post('/biography', jsonParser, async (req,res) => {
    try {
        const profilePicture = {
            userId : req.body.userId,
            biography : req.body.biography,
        }
        const db = await getDB();
        if(await dbLib.updateBiography(db, profilePicture)) {
            console.log("Biography Update Successful");
            res.status(201).send({
                "message" : "Biography updated successfully"
            })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message})
    }
})

router.post('/post', jsonParser, async (req, res) => {
    try {
        if(req.body.userId === undefined) {
            throw Error("No userId provided")
        }
        const newPost = {
            postId: uuid.v4(),
            userId: req.body.userId,
            userName: req.body.userName,
            caption: req.body.caption,
            data: req.body.data,
            type: req.body.type,
            tagged : req.body.tagged ? req.body.tagged : [],
            createTime : Date.now(),
            updateTime : Date.now()
        }
        const db = await getDB();
        const createResult = await dbLib.createPost(db, newPost);

        // if(req.headers['version'] !== 'test') {
        //     followers = await dbLib.getUserFollowerIds(db, req.body.userId);
        //     for (const [userId, ws] of clients) {
        //         if (followers.includes(userId)) {
        //             ws.send("Your friend " + req.body.userName + "just posted something new!");
        //             console.log("Your friend " + req.body.userName + "just posted something new!")
        //         }
        //     }
        // }
        res.status(201).send(createResult);
    } catch (err) {
        res.status(err.status ? err.status : 500).send({ message: 'Error create posts'});
    }
});

module.exports = {router, clients};