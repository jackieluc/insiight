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
  const joinCode = payload.joinCode;

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const discussions = db.collection('discussions');

    // Happy path
    discussions.findOne({ joinCode: joinCode }, function(err, discussionThread) {
      if (err) errorResponse(callback, err);

      // if no discussion thread exists, insert new one
      if (!discussionThread) {
        console.log('Discussion thread not found.');
        connection.close();
        successResponse(callback, { response: null });
      }
      else {
        console.log('Found comments in discussion thread.');
        
        const { discussionID, comments } = discussionThread;
  
        const sortedComments = comments.sort(function(a, b) {
          return b.upvotes - a.upvotes;
        });
  
        const response = {
          discussionID: discussionID,
          comments: sortedComments
        };
  
        connection.close();
        successResponse(callback, response);
      };
    });
  });
}