const request = require('supertest');
const { connect, closeConnection, getConn } = require('../dbFunctions');
const app = require('../index')

let mongoConn;

// Test comment fetching apis
describe('/auth/signup endpoint integration test', () => {
    let db;
    let response;
    let testSignUpUserObjectId;
    let testUserId;
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

    test('The new user tries to sign up again', async() => {
        // test return new comment fields
        response = await request(app).post('/auth/signup').set('version', 'test').send(testSignUpUser)
        expect(response.status).toBe(409)
    });

    test('The new user is in database', async () => {
        const newTestUser = await db.collection('users').findOne({ userId: testUserId });
        expect(newTestUser.email).toEqual(testSignUpUser.email);
    })

    test('The new user tries to signIn', async () => {
        response = await request(app).post('/auth/signin').set('version', 'test').send({
            email : testSignUpUser.email,
            password : testSignUpUser.password
        })
        expect(response._body.userId).toBe(testUserId);
    })

    test('The new user tries to signIn with wrong password', async () => {
        response = await request(app).post('/auth/signin').set('version', 'test').send({
            email : testSignUpUser.email,
            password : "wrongPassword"
        })
        expect(response.status).toBe(401);
    })
});