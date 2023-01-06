const request = require('supertest');
const { connect, closeConnection, getConn } = require('../dbFunctions');
const app = require('../index')

let mongoConn;

// Test comment fetching apis
describe('POST comments endpoint integration test', () => {
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

    test('The new comment is returned', async() => {
        // test return new comment fields
        expect(response._body._id).not.toBeNull();
        expect(response._body.commentId).not.toBeNull();
        expect(response._body.postId).toEqual(testComment.postId);
        expect(response._body.userId).toEqual(testComment.userId);
        expect(response._body.userName).toEqual(testComment.userName);
        expect(response._body.commentText).toEqual(testComment.commentText);
    });

    test('The new comment is in database', async () => {
        const insertedComment = await db.collection('comments').findOne({ commentId: testCommentId });
        expect(insertedComment.userName).toEqual(testComment.userName);
    })
});