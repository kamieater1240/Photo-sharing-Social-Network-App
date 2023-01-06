const dbLib = require("./dbFunctions");
const {getConn, getDB} = require("./dbFunctions");
const express = require("express");
const router = express.Router()
const uuid = require('uuid');
const bcrypt = require("bcrypt")
const salt = "$2b$10$UdNqpnkWmAYDcyiP/QbYee";
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.post('/signup', jsonParser, async (req,res) => {
    try {
        const newUser = {
            userId : uuid.v4(),
            userName : req.body.userName ? req.body.userName : req.body.firstName + req.body.lastName,
            firstName: req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            biography : "",
            profilePicture : "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAKACAYAAAAMzckjAABIhklEQVR4Xu3d2V4USbc34H3/t7AP9kGrbSsyCzjgBK04DyANqAwqQ1EFfncQX65IErFARWWoqnwOnh/99uvUUlnxr4hYa/3P543NBABAffxP+78AAKC3CYAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAIA1IwACABQMwIgAEDNCIAAADUjAAI9ba3w8fP6Hzj8awJ0OwEQ6FrtYa369+ubm2ljq5E2G420td1MjWYrbbd2UnNP6weqHxM/frv4efHzNxvb+dcLP/u9AbqBAAh0hf2wtfe/I4xFOIug1trZSTs7u6lZfG00I7A10nrxY9Y+rad3K6tpYel9mltY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",
            password: bcrypt.hashSync(req.body.password, salt)
        };
        const db = await dbLib.getDB();
        if(await dbLib.registerNewUser(db, newUser)) {
            console.log("Password Compare -> ", bcrypt.compareSync(req.body.password, newUser.password))
            delete newUser["password"];
            res.send(newUser);
        }
    } catch (err) {
        console.log(err.message);
        res.status(409).send({message : err.message})
    }
})

router.post('/signin', jsonParser, async (req,res) => {
    console.log("Session ID for : ", req.body.email , " is ", req.sessionID);
    try {
        const user = {
            email : req.body.email,
            password: bcrypt.hashSync(req.body.password, salt)
        };
        if(req.session.authenticated && req.body.email && req.body.password) {
            console.log("Request Session Authenticated");
            res.send(req.session.user);
        } else {
            const db = await getDB();
            const checkAccountLocked = await dbLib.checkAccountLocked(db,user);
            if(checkAccountLocked.length > 0 && checkAccountLocked[0].incorrectTimes >= 3 &&
                Date.now() < checkAccountLocked[0].lockedTime + 1000*60*60*2) {
                throw Error("Account is currently locked")
            }
            const loggedInUser = await dbLib.loginUser(db, user);
            delete loggedInUser["password"];
            req.session.authenticated = true;
            req.session.user = loggedInUser;
            req.session.save(err => {
                if(err){
                    console.log(err);
                    throw new Error("Error logging in : Session Save Failed");
                } else {
                    console.log("Successful Session Save")
                    res.send(req.session.user);
                }})

        }
    } catch (err) {
        console.log(err.message);
        res.status(401).send({message : err.message})
    }
})

router.get('/signout', jsonParser, async (req,res) => {
    console.log("Session ID for logout is ", req.sessionID);
    try {
        req.session.destroy(err => {
            if(err){
                console.log(err);
            } else {
                res.status(200).send({message: "Successfully destroyed session"})
            }
        });
        // req.session.destroy(function () {
        //     res.status(200).send({
        //         message: "Successfully destroyed session"
        //     });
        // })
    } catch (error) {
        console.log( "Error Logging Out : ", err.message);
        res.status(500).send(err.message);
    }
})

module.exports = router;