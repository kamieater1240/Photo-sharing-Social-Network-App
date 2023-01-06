const request = require('supertest');
const { closeConnection, connect, getConn } = require('../dbFunctions');
const webapp = require('../index');

let mongoConn;


describe('GET follow(s) endpoint integration test', () => {
    /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
  */
    let db;
    let response;
    let testFollowObjId;
    let testFollowDataId;
    // test resource to create / expected response
    const testFollow = {  
        userId: "123456", 
        followId: "456789"
    };
    /**
       * Make sure that the data is in the DB before running
       * any test
       * connect to the DB
       */
    beforeAll(async () => {
        db = await connect();
        mongoConn = await getConn();
        response = await request(webapp).post('/follow').set('version', 'test').send(testFollow);
        testFollowObjId = response._body._id;
        testFollowDataId = response._body.followDataId;

        console.log(response._body);
    });
  
    const clearDatabase = async () => {
      try {
        const result = await db.collection('follows').deleteOne({ followDataId: testFollowDataId });
        const { deletedCount } = result;
        if (deletedCount === 1) {
          console.log('info', 'Successfully deleted test follow');
        } else {
          console.log('warning', 'test follow was not deleted');
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
    
    test('Get a follow data by userId', async () => {
        const resp = await request(webapp).get('/follow').set('version', 'test').query({userId: "123456"});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const followData = resp._body;

        // testUser is in the response
        expect(followData).toMatchObject([{ _id: testFollowObjId, followDataId: testFollowDataId,  ...testFollow }]);
    });

    test('Get a follow data by followId', async () => {
        const resp = await request(webapp).get('/follow').set('version', 'test').query({followId: "456789"});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const followData = resp._body;

        // testUser is in the response
        expect(followData).toMatchObject([{ _id: testFollowObjId, followDataId: testFollowDataId,  ...testFollow }]);
    });

    test('Get a follow data by followId and userId', async () => {
        const resp = await request(webapp).get('/follow').set('version', 'test').query({userId: "123456", followId: "456789"});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const followData = resp._body;

        // testUser is in the response
        expect(followData).toMatchObject({ _id: testFollowObjId, followDataId: testFollowDataId,  ...testFollow });
    });

    test('userId not in db status code 404', async () => {
        const resp = await request(webapp).get('/follow').set('version', 'test').query({userId: "1"});
        expect(resp.status).toEqual(200);
        expect(resp.body.length).toEqual(0);
    })
});