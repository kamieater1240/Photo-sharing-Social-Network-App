// import the mongodb driver
const {MongoClient} = require('mongodb');
let conn;

// import ObjectId
const {ObjectId} = require('mongodb');

// the mongodb server URL
const dbURL = 'mongodb+srv://kycjosh:557@cluster0.wad7swc.mongodb.net/?retryWrites=true&w=majority';

// connection to the db
const connect = async () => {
    try {
        conn = (await MongoClient.connect(
            dbURL,
            {useNewUrlParser: true, useUnifiedTopology: true}
        ));
        // check that we are connected to the db
        console.log(`connected to db: ${conn.db('db').databaseName}`);
        return conn.db('db');
    } catch (err) {
        console.log(err.message);
        throw err;
    }
};

// returns the database attached to this MongoDB connection
const getDB = async () => {
    if (!conn) {
        await connect();
    }
    return conn.db('db');
}

// close the mongodb connection
const closeConnection = async () => {
    await conn.close();
}

const getAllPosts = async (db, limit, skip) => {
    try {
        const result = await db.collection('posts').find({}).sort({ updateTime: -1}).limit(limit).toArray();
        // print the results
        // console.log(`Posts: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        // console.log(err);
        throw err;
    }
}

const getPostByPid = async (db, pid) => {
    try {
        const result = await db.collection('posts').find({postId : pid}).toArray();
        // print the results
        // console.log(`Posts: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        throw err;
    }
}

// READ user's all posts
const getUserAllPosts = async (db, userId) => {
    try {
        const result = await db.collection('posts').find({userId : userId }).toArray();
        // print the results
        // console.log(`Posts: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ post's all comments
const getPostsAllComments = async (db, postId) => {
    try {
        const result = await db.collection('comments').find({ postId: postId });
        // print the results
        // console.log(`Comments: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ user's data
const getUserData = async (db, userId) => {
    try {
        const result = await db.collection('users').findOne({ userId: userId });
        if (result.length === 0) {
            throw Error("No user found in collections.");
        } else {
            delete result["password"]
            return result;
        }
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ all user data
const getAllUser = async (db) => {
    try {
        const result = await db.collection('users').find({}).toArray();
        if (result.length !== 0) {
            for (const user of result) {
                delete user["password"];
            }
        }
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ all follow data
const getAllFollow = async (db) => {
    try {
        const result = await db.collection('follows').find({}).toArray();
        // print the results
        console.log(`Follow: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ user's all following id data
const getUserFollowingIds = async (db, userId) => {
    try {
        const result = await db.collection('follows').find({ userId: userId }).toArray();
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// READ user's all follower id data
const getUserFollowerIds = async (db, followId) => {
    try {
        const result = await db.collection('follows').find({ followId: followId }).toArray();
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// REAd a follow data
const getFollowData = async (db, userId, followId) => {
    try {
        const result = await db.collection('follows').findOne({ userId: userId, followId: followId });
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// CREATE new follow data
const createNewFollowData = async (db, newFollowData) => {
    try {
        const result = await db.collection('follows').insertOne(newFollowData);
        // print the results
        console.log(`Created Follow Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
}

// DELETE follow data
const deleteFollowData = async (db, followDataId) => {
    try {
        console.log(followDataId);
        const result = await db.collection('follows').deleteOne(
            { followDataId: followDataId },
          );
        // print the results
        console.log(`Delete Follow Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
}

const getComments = async (db, postId) => {
    try {
        const result = await db.collection('comments').find({postId: postId}).toArray();
        // console.log(`Comments: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        throw err;
    }
}

const createComment = async (db, newComment) => {
    try {
        const newCommentResult = await db.collection('comments').insertOne(newComment);
        // console.log(`CreateComments: ${JSON.stringify(newCommentResult)}`)
        return newCommentResult;
    } catch (err) {
        throw err;
    }
}

const deleteComment = async (db, commentId) => {
    try {
        const deleteResult = await db.collection('comments').deleteOne({ commentId: commentId });
        return deleteResult;
    } catch (err) {
        throw err;
    }
}

const editComment = async (db, commentId, newComment) => {
    try {
        const result = await db.collection('comments').updateOne({commentId: commentId},
                                                                {$set:{commentText: newComment.commentText}});
        // console.log(result);
        return result;
    } catch (err) {
        throw err;
    }
}

const registerNewUser = async (db, newUser) => {
    try {
        const result = await db.collection('users').find({email: newUser.email}).toArray();
        if (result.length === 0) {
            newUserResult = await db.collection('users').insertOne(newUser);
        } else {
            throw Error("User Email Already Exists");
        }
        console.log(`User Created: ${JSON.stringify(newUserResult)}`);
        return result;
    } catch (err) {
        throw err;
    }
}

const loginUser = async (db, user) => {
    try {
        const result = await db.collection('users').find(user).toArray();
        if (result.length === 1) {
            const update = await db.collection('account_locked').deleteOne({
                email : user.email
            })
            return result[0];
        } else {
            await db.collection('account_locked').updateOne(
                {email: user.email},
                {$set: {lockedTime : Date.now()}, $inc: {incorrectTimes: 1}},
                {upsert : true}
            )
            throw Error("User Email or Password is Incorrect");
        }
    } catch (err) {
        throw err;
    }
}

const uploadProfilePicture = async (db, profilePictureData) => {
    try {
        const result = await db.collection('users').updateOne(
            { userId: profilePictureData.userId },
            {
                $set: {
                    profilePicture : profilePictureData.profilePicture
                }
            })
        if (result.matchedCount === 1) {
            return true;
        } else {
            throw Error("Error Uploading Profile Picture");
        }
    } catch (err) {
        throw err;
    }
}
const updateBiography = async (db, biographyData) => {
    try {
        const result = await db.collection('users').updateOne(
            { userId: biographyData.userId },
            {
                $set: {
                    biography : biographyData.biography
                }
            })
        if (result.matchedCount === 1) {
            return true;
        } else {
            throw Error("Error Updating Biography");
        }
    } catch (err) {
        throw err;
    }
}

const updateCaption = async (db, newCaption) => {
    try {
        const result = await db.collection('posts').updateOne(
            { postId: newCaption.postId  },
            {
                $set: {
                    caption : newCaption.caption,
                    updateTime : Date.now()
                }
            })
        if (result.matchedCount === 1) {
            return true;
        } else {
            throw Error("Error Updating Biography");
        }
    } catch (err) {
        throw err;
    }
}

const createPost = async (db, newPost) => {
    try {
        const newPostResult = await db.collection('posts').insertOne(newPost);
        console.log(`CreatePosts: ${JSON.stringify(newPostResult)}`)
        return newPostResult;
    } catch (err) {
        throw err;
    }
}

const deletePost = async (db, postId) => {
    try {
        const deleteResult = await db.collection('posts').deleteOne({ postId: postId });
        return deleteResult;
    } catch (err) {
        throw err;
    }
}

// REAd a like data
const getLikeData = async (db, userId, postId) => {
    try {
        const result = await db.collection('likes').findOne({ userId: userId, postId: postId });
        // print the results
        console.log(`Like Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// CREATE new like data
const createNewLikeData = async (db, newLikeData) => {
    try {
        const result = await db.collection('likes').insertOne(newLikeData);
        // print the results
        console.log(`Created Like Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
}

// DELETE like data
const deleteLikeData = async (db, likeDataId) => {
    try {
        console.log(likeDataId);
        const result = await db.collection('likes').deleteOne(
            { likeDataId: likeDataId },
          );
        // print the results
        console.log(`Delete Like Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
}

const checkAccountLocked = async (db, user) => {
    try {
        const accountLocked = await db.collection('account_locked').findOne({ email: user.email });
        if (accountLocked) {
            return [accountLocked];
        } else {
            return [] ;
        }
    } catch (err) {
        throw err;
    }
}

// REAd a visibility data
const getVisibilityData = async (db, userId) => {
    try {
        const result = await db.collection('visibility').find({ userId: userId }).toArray();
        // print the results
        console.log(`Visibility Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
};

// CREATE new visibility data
const createNewVisibilityData = async (db, newVisibilityData) => {
    try {
        const result = await db.collection('visibility').insertOne(newVisibilityData);
        // print the results
        console.log(`Created Visibility Data: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        console.log(`error: ${err.message}`);
        throw err;
    }
}

const getConn = () => conn;
module.exports = {
    connect, getUserAllPosts, getPostsAllComments, getAllUser, getUserData, getUserFollowingIds, getUserFollowerIds, getAllFollow,
    createNewFollowData, deleteFollowData, getAllPosts, getConn, registerNewUser, loginUser, getComments, createComment, deleteComment, 
    editComment, getFollowData, getDB, closeConnection, getAllPosts, getConn, registerNewUser, loginUser, getComments, createComment, 
    deleteComment, editComment, uploadProfilePicture, updateBiography, createPost, updateCaption, getPostByPid, deletePost,
    getLikeData, createNewLikeData, deleteLikeData, checkAccountLocked, getVisibilityData, createNewVisibilityData
};
