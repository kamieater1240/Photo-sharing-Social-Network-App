const request = require('supertest');
const { connect, closeConnection, getConn } = require('../dbFunctions');
const app = require('../index')

let mongoConn;

// Test comment fetching apis
describe('DELETE comments endpoint integration test', () => {
    let db;
    let response;
    let testcommentObjId;
    let testCommentId;
    const testComment = {postId : "fce45e88-0a5d-480d-ac37-94b0f43faffe",
    userId : "9aef2c24-3aab-41ab-8415-b6ea68780141",
    userName : "PranshuKumar",
    commentText : "Random"};

    beforeAll(async () => {
        db = await connect();
        mongoConn = await getConn();
        response = await request(app).post('/comment').set('version', 'test').send(testComment);
        
        testcommentObjId = response._body._id;
        testCommentId = response._body.commentId;
    });

    const clearDatabase = async () => {
        try {
            const res = await db.collection('comments').deleteOne({ commentId: testCommentId });
            const { deletedCount } = res;
            if (deletedCount === 1) {
                console.log('info', 'Successfully deleted test comment');
            } else {
                console.log('warning', 'test student was not deleted');
            }
        } catch (err) {
            // throw err;
            console.log('error', err.message);
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

    test('Endpoint response: status code, type and content', async () => {
        // successful deletion returns 200 status code
        const resp = await request(app).delete(`/comment/` + testCommentId).set('version', 'test');
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        // the user is not in the database
        const resp1 = await db.collection('comments').findOne({ commentId: testCommentId });
        expect(resp1).toBeNull();
    });

    test('comment id not in system (correct id format) - response 404', async () => {
        const resp = await request(app).delete(`/comment/1`).set('version', 'test');
        expect(resp.status).toEqual(404);
    });
});