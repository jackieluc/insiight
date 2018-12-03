const { MongoClient } = require('mongodb');
const { insiightDb, insiightUser, insiightPw } = process.env;

const DB_URL = `mongodb://${insiightUser}:${insiightPw}@ds151863.mlab.com:51863/${insiightDb}`;

function errorResponse(callback, err) {
  console.error('END: Error response.');
  console.error(err);

  callback(null, {
    statusCode: 500,
    body: JSON.stringify({ error: err })
  });
};

function successResponse(callback, res) {
  console.log('END: Success response.');

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(res)
  });
};

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');

  const payload = JSON.parse(event.body);
  const { email, discussionID, commentID } = payload;

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const users = db.collection('users');
    const discussions = db.collection('discussions');

    const findComment = {
      discussionID: discussionID,
      'comments.commentID': commentID.toString()
    };

    const incrementUpvote = {
      $inc: { 
        'comments.$.upvotes': 1
      }
    };

    // Happy path
    discussions.updateOne(findComment, incrementUpvote, function(err, result) {
      if (err) errorResponse(callback, err);

      console.log(`Successfully upvoted the comment ${commentID} in the discussion thread ${discussionID}`);

      const addToMyUpvotes = {
        $addToSet: {
          myUpvotes: commentID.toString()
        }
      }

      users.updateOne({ email: email }, addToMyUpvotes, function(err, result) {
        if (err) errorResponse(callback, err);

        console.log('Updated student\'s upvote list to prevent repeated upvotes.');

        connection.close();
        successResponse(callback, { response: 'success' });
      });
    });
  });
}