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

/**
 * Generates a random 4 digit ID
 * @returns - String
 */
function getNewId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');

  const payload = JSON.parse(event.body);
  const email = payload.email;
  const joinCode = payload.joinCode;
  const comment = payload.comment;

  const thread = {
    discussionID: getNewId(),
    joinCode: joinCode,
    comments: []
  };

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const users = db.collection('users');
    const discussions = db.collection('discussions');

    // Happy path
    discussions.findOne({ joinCode: joinCode }, function(err, discussionThread) {
      if (err) errorResponse(callback, err);

      // if no discussion thread exists, insert new one
      if (!discussionThread) {
        console.log('Discussion thread not found, inserting new discussion thread in the database.');

        discussions.insert(thread, function(err, result) {
          if (err) errorResponse(callback, err);
          console.log('New discussion thread inserted into the database.');
        });
      }
      else {
        // discussion thread exists, get discussionID
        thread.discussionID = discussionThread.discussionID;
      }

      const commentID = getNewId();
      const addComment = {
        $addToSet: {
          comments: {
            commentID: commentID,
            message: comment,
            upvotes: 0
          }
        }
      };

      // update the discussion thread with the new comment
      discussions.updateOne({ discussionID: thread.discussionID }, addComment, { returnNewDocument: true }, function(err, result) { 
        if (err) errorResponse(callback, err);

        const updateUserComments = {
          $set: {
            myUpvotes: []
          },
          $addToSet: {
            myComments: commentID,
          }
        };
        
        users.updateOne({ email: email }, updateUserComments, function(err, acknowledge) {
          if (err) errorResponse(callback, err);
          console.log('Added comment to user profile.');

          const response = {
            commentID: commentID,
            message: comment,
            upvotes: 0
          };
          
          connection.close();
          successResponse(callback, response);
        });
      });
    });
  });
}