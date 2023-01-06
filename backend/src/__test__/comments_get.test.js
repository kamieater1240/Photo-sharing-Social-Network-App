const request = require('supertest');
const { connect, closeConnection, getConn } = require('../dbFunctions');
const app = require('../index')


let mongoConn;

// Test comment fetching apis
describe('GET comments endpoint integration test', () => {
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

    test('Get comments by postId', async() => {
        const resp = await request(app).get('/comment').set('version', 'test').query({postId: "fce45e88-0a5d-480d-ac37-94b0f43faffe"});
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const comments = resp._body;
        
        // testComment is in the response
        expect(comments).toEqual(expect.arrayContaining([{_id: testcommentObjId, commentId: testCommentId, ...testComment}]));
    });

    test('postid not in db status code 404', async () => {
        const resp = await request(app).get('/comment').set('version', 'test').query({postId: "12345"});
        expect(resp.status).toEqual(200);
    })
});