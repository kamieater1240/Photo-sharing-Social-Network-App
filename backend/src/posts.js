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
            console.log('READ a user all posts');
            const db = await getDB();
            console.log(req.query.userId);
            results = await dbLib.getUserAllPosts(db, req.query.userId);
            // send the response with the appropriate status code
            res.status(200).send(results);
        }
        else {
            const limit = parseInt(req.query._limit);
            // const skip = (parseInt(req.query._page) - 1)*limit;
            const db = await getDB();
            results = await dbLib.getAllPosts(db, limit);
            // send the response with the appropriate status code
            res.status(200).send(results);
        }
        
    } catch (err) {
        res.status(404).json({ message: 'Error fetching posts from database' });
    }
});

router.get('/:pid', async (req, res) => {
    console.log('READ particular post');
    try {
            const db = await getDB();
            const result = await dbLib.getPostByPid(db, req.params.pid);
        // send the response with the appropriate status code
            res.status(200).send(result);
    } catch (err) {
        res.status(404).json({ message: 'Error fetching posts from database' });
    }
});
router.put('/updateCaption', jsonParser, async(req, res) => {
    try {
        const newCaption = {
            postId : req.body.postId,
            caption : req.body.caption
        }
        const db = await getDB();
        const result = await dbLib.updateCaption(db, newCaption);
        res.status(200).send(newCaption);
    } catch (err) {
        res.status(404).json({ message: 'Error fetching posts from database' });
    }
})

router.delete('/:postId', async (req, res) => {
    try {
        const db = await dbLib.getDB();
        const deleteResult = await dbLib.deletePost(db, req.params.postId);
        const { deletedCount } = deleteResult;
        if (deletedCount === 1) {
            res.send(deleteResult);
        } else {
            res.status(404).json({message: 'No such comment'});
        }
        
    } catch (err) {
        res.status(404).json({message: 'Error delete comment'});
    }
});

module.exports = router;