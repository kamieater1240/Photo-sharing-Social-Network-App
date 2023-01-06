const request = require('supertest');
const { closeConnection, connect, getConn } = require('../dbFunctions');
const webapp = require('../index');

let mongoConn;

// TEST POST ENDPOINT
describe('GET user(s) endpoint integration test', () => {
    /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
  */
    let db;
    let testUserObjId;
    let testUserId;
    // test resource to create / expected response
    const testUser = {  
                        firstName: "TestFirstName",
                        lastName: "TestLastName",
                        email: "testuser@seas.upenn.edu",
                        password: "123456"
    };
    const testUserReponse = {  
      firstName: "TestFirstName",
      lastName: "TestLastName",
      email: "testuser@seas.upenn.edu"
    };
    /**
       * Make sure that the data is in the DB before running
       * any test
       * connect to the DB
       */
    beforeAll(async () => {
        db = await connect();
        mongoConn = await getConn();
        const res = await request(webapp).post('/auth/signup').set('version', 'test').send(testUser);
        testUserObjId = res._body._id;
        testUserId = res._body.userId;
    });
  
    const clearDatabase = async () => {
      try {
        const result = await db.collection('users').deleteOne({ userId: testUserId });
        const { deletedCount } = result;
        if (deletedCount === 1) {
          console.log('info', 'Successfully deleted test user');
        } else {
          console.log('warning', 'test user was not deleted');
        }
      } catch (err) {
        console.log('error', err.message);
      }
    };
    /**
   * Delete all test data from the DB
   * Close all open connections
   */
    afterAll(async () => {
      await clearDatabase();
      try {
        await mongoConn.close();
        await closeConnection(); // mongo client that started server.
      } catch (err) {
        return err;
      }
    });

    test('Get a user endpoint status code and data', async () => {
        const resp = await request(webapp).get('/user').set('version', 'test').query({userId: testUserId});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const userArr = resp._body;

        // testUser is in the response
        expect(userArr).toMatchObject({ _id: testUserObjId, userId: testUserId, ...testUserReponse });
    });

    test('userId not in db status code 404', async () => {
      const resp = await request(webapp).get('/user').set('version', 'test').query({userId: "1"});
      expect(resp.status).toEqual(404);
    })
});