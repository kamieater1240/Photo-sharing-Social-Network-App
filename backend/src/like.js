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
        if (req.query.userId != null && req.query.postId != null) {
            console.log("READ a like data's Id");
            const db = await getDB();
            results = await dbLib.getLikeData(db, req.query.userId, req.query.postId);
        }
        
        // send the response with the appropriate status code
        res.status(200).send(results);
    } catch (err) {
        res.status(404).send({ message: 'there was an error' });
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        console.log("Create a new like data");
        const newLikeData = {
            likeDataId: uuid.v4(),
            userId: req.body.userId,
            postId: req.body.postId
        };
        // create the data in the db
        const db = await getDB();
        const results = await dbLib.createNewLikeData(db, newLikeData);
        // send the response with the appropriate status code
        res.status(200).send(newLikeData);
    } catch (err) {
        res.status(404).json({ message: 'there was an error in creating new like data' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // delete the data in the db
        console.log("Delete a like data's Id");
        const db = await getDB();
        const results = await dbLib.deleteLikeData(db, req.params.id);
        // send the response with the appropriate status code
        res.status(200).send(results);
    } catch (err) {
        res.status(404).json({ message: 'there was an error in deleting like data' });
    }
});

module.exports = router;