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
        if (req.query.userId != null) {
            console.log("READ a visibility data's Id");
            const db = await getDB();
            results = await dbLib.getVisibilityData(db, req.query.userId);
        }
        
        // send the response with the appropriate status code
        res.status(200).send(results);
    } catch (err) {
        res.status(404).send({ message: 'there was an error' });
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        console.log("Create a new visibility data");
        const newVisibilityData = {
            visibilityDataId: uuid.v4(),
            userId: req.body.userId,
            postId: req.body.postId
        };
        // create the data in the db
        const db = await getDB();
        const results = await dbLib.createNewVisibilityData(db, newVisibilityData);
        // send the response with the appropriate status code
        res.status(200).send(newVisibilityData);
    } catch (err) {
        res.status(404).json({ message: 'there was an error in creating new visibility data' });
    }
});

module.exports = router;