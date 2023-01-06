const dbLib = require("./dbFunctions");
const {getDB} = require("./dbFunctions");
const express = require("express");
const router = express.Router()
const uuid = require('uuid');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.get('/', jsonParser, async (req, res) => {
    try {
        // get the data from the db
        const db = await dbLib.getDB();
        const results = await dbLib.getComments(db, req.query.postId);
        // send the response with the appropriate status code
        res.status(200).send(results);
    } catch (err) {
        res.status(404).json({ message: 'Error fetching posts from database' });
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        
        const newComment = {
            commentId: uuid.v4(),
            postId: req.body.postId,
            userId: req.body.userId,
            userName: req.body.userName,
            commentText: req.body.commentText,
        }
        const db = await dbLib.getDB();
        await dbLib.createComment(db, newComment);
        res.send(newComment);
    } catch (err) {
        res.status(404).json({ message: 'Error create comment'});
    }
});

router.put('/:commentId', jsonParser, async (req, res) => {
    try {
        const newComment = {
            commentText: req.body.commentText,
        }
        const db = await dbLib.getDB();
        const updateResult = await dbLib.editComment(db, req.params.commentId, newComment);
        res.send(updateResult);
    } catch (err) {
        res.status(404).json({message: 'Error update comment'});
    }
});

router.delete('/:commentId', async (req, res) => {
    try {
        const db = await dbLib.getDB();
        const deleteResult = await dbLib.deleteComment(db, req.params.commentId);
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