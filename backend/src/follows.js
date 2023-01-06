const dbLib = require("./dbFunctions");
const {getConn, getDB} = require("./dbFunctions");
const express = require("express");
const router = express.Router()
const uuid = require('uuid');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.get('/', async (req, res) => {
    try {
        let results;
        // get the data from the db
        if (req.query.userId == null && req.query.followId == null) {
            console.log("READ all follow data");
            const db = await getDB();
            results = await dbLib.getAllFollow(db);
        }
        else if (req.query.userId != null && req.query.followId == null) {
            console.log("READ a user's following data");
            const db = await getDB();
            results = await dbLib.getUserFollowingIds(db, req.query.userId);
        }
        else if (req.query.userId == null && req.query.followId != null) {
            console.log("READ a user's follower data");
            const db = await getDB();
            results = await dbLib.getUserFollowerIds(db, req.query.followId);
        }
        else {
            console.log("READ a follow data's id");
            const db = await getDB();
            results = await dbLib.getFollowData(db, req.query.userId, req.query.followId);
        }
        
        // send the response with the appropriate status code
        res.status(200).send(results);
        console.log(results);
    } catch (err) {
        res.status(404).send({ message: 'there was an error' });
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        console.log("Create a new follow data");
        const newFollowData = {
            followDataId: uuid.v4(),
            userId: req.body.userId,
            followId: req.body.followId
        };
        // create the data in the db
        const db = await getDB();
        const results = await dbLib.createNewFollowData(db, newFollowData);
        // send the response with the appropriate status code
        res.status(200).send(newFollowData);
    } catch (err) {
        res.status(404).json({ message: 'there was an error in creating new follow data' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // delete the data in the db
        console.log("Delete a follow data");
        const db = await getDB();
        const results = await dbLib.deleteFollowData(db, req.params.id);
        // send the response with the appropriate status code
        res.status(200).send(results);
    } catch (err) {
        res.status(404).json({ message: 'there was an error in deleting follow data' });
    }
});

module.exports = router;