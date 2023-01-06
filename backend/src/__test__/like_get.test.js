const request = require('supertest');
const { closeConnection, connect, getConn } = require('../dbFunctions');
const webapp = require('../index');

let mongoConn;


describe('GET like(s) endpoint integration test', () => {
    /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
  */
    let db;
    let response;
    let testLikeObjId;
    let testLikeDataId;
    // test resource to create / expected response
    const testLike = {  
        userId: "123456", 
        postId: "456789"
    };
    /**
       * Make sure that the data is in the DB before running
       * any test
       * connect to the DB
       */
    beforeAll(async () => {
        db = await connect();
        mongoConn = await getConn();
        response = await request(webapp).post('/like').set('version', 'test').send(testLike);
        testLikeObjId = response._body._id;
        testLikeDataId = response._body.likeDataId;

        console.log(response._body);
    });
  
    const clearDatabase = async () => {
      try {
        const result = await db.collection('likes').deleteOne({ likeDataId: testLikeDataId });
        const { deletedCount } = result;
        if (deletedCount === 1) {
          console.log('info', 'Successfully deleted test like');
        } else {
          console.log('warning', 'test like was not deleted');
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

    test('Get a follow data by userId and postId', async () => {
        const resp = await request(webapp).get('/like').set('version', 'test').query({userId: "123456", postId: "456789"});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const likeData = resp._body;

        // testUser is in the response
        expect(likeData).toMatchObject({ _id: testLikeObjId, likeDataId: testLikeDataId,  ...testLike });
    });

    test('userId not in db status code 404', async () => {
        const resp = await request(webapp).get('/like').set('version', 'test').query({userId: "1", postId: "4"});
        expect(resp.status).toEqual(200);
    })
});