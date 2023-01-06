const request = require('supertest');
const { connect, closeConnection, getConn } = require('../dbFunctions');
const app = require('../index')
const uuid = require("uuid");
const session = require('express-session');
let mongoConn;

// Test comment fetching apis
describe('/auth/signup endpoint integration test', () => {
    let db;
    let response;
    let testSignUpUserObjectId;
    let testUserId;
    let testUserName;
    const testSignUpUser = {
        "firstName": "Cristiano",
        "lastName": "Ronaldo",
        "email": "cristiano@seas.upenn.edu",
        "password": "password"
    };

    beforeAll(async () => {
        db = await connect();
        mongoConn = await getConn();
        response = await request(app).post('/auth/signup').set('version', 'test').send(testSignUpUser);

        testSignUpUserObjectId = response._body._id;
        testUserId = response._body.userId;
        testUserName = response._body.userName;
    });

    const clearDatabase = async () => {
        try {
            const res = await db.collection('users').deleteOne({ userId: testUserId });
            const { deletedCount } = res;
            if (deletedCount === 1) {
                console.log('info', 'Successfully deleted test user');
            } else {
                console.log('warning', 'test user was not deleted');
            }

            const response = await db.collection('posts').deleteMany({ userId: testUserId });
            const { deletedPostCount } = response;
            if (deletedPostCount !== 0) {
                console.log('info', 'Successfully deleted test user posts');
            } else {
                console.log('warning', 'test user posts was not deleted');
            }

        } catch (err) {
            console.log('error', err.message);
            throw err
        }
    }

    // Delete test data from DB
    // Close all open connections
    afterAll(async () => {
        await clearDatabase();
        try {
            await mongoConn.close();
            await closeConnection();
        } catch (err) {
            return err;
        }
    });

    test('The new user is returned', async() => {
        // test return new comment fields
        expect(response._body._id).not.toBeNull();
        expect(response._body.userId).not.toBeNull();
        expect(response._body.userName).toEqual("CristianoRonaldo");
    });

    test('The user wants to update his bio', async() => {
        // test return new comment fields
        const uploadBiography = {
            userId : testUserId,
            biography : "test biography"
        }
        response = await request(app).post('/upload/biography').set('version', 'test').send(uploadBiography)
        expect(response.status).toBe(201)
        expect(response._body.message).toBe("Biography updated successfully")
    });

    test('The user wants to update his bio but error', async() => {
        // test return new comment fields
        const uploadBiography = {}
        response = await request(app).post('/upload/biography').set('version', 'test').send(uploadBiography)
        expect(response.status).toBe(500)
    });

    test('The user wants to update his profilePicture', async() => {
        // test return new comment fields
        const uploadProfilePicture = {
            userId : testUserId,
            biography : "Base64EncodedString"
        }
        response = await request(app).post('/upload/profilePicture').set('version', 'test').send(uploadProfilePicture)
        expect(response.status).toBe(201)
        expect(response._body.message).toBe("Profile Picture updated successfully")
    });

    test('The user wants to update his profile picture but error', async() => {
        // test return new comment fields
        const uploadProfilePicture = {}
        response = await request(app).post('/upload/profilePicture').set('version', 'test').send(uploadProfilePicture)
        expect(response.status).toBe(500)
    });

    test('The user wants to upload a Post', async() => {
        // test return new comment fields
        const uploadPost = {
            userId: testUserId,
            userName: testUserName,
            caption: "Random Caption",
            data: "Base64 Encoded",
            type: "image/jpg",
            tagged : [],
        }
        response = await request(app).post('/upload/post').set('version', 'test').send(uploadPost)
        expect(response.status).toBe(201)
    });

    test('The user wants to upload a Post but error', async() => {
        // test return new comment fields
        const uploadPost = {}
        response = await request(app).post('/upload/post').set('version', 'test').send(uploadPost)
        expect(response.status).toBe(500)
    });
});