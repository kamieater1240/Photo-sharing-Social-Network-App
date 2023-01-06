const dbLib = require("./dbFunctions");
const {getConn} = require("./dbFunctions");
const express = require("express");
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let results;
        // get the data from the db
        if (req.query.userId != null) {
            console.log("READ a user's data");
            const db = await dbLib.getDB();
            results = await dbLib.getUserData(db, req.query.userId);
        }
        else {
            // console.log("READ all user's data");
            const db = await dbLib.getDB();
            results = await dbLib.getAllUser(db);
        }
        // send the response with the appropriate status code
        res.status(200).send(results)
    } catch (err) {
        res.status(404).json({ message: 'there was an error' });
    }
});

module.exports = router;