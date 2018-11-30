const { MongoClient } = require('mongodb');

const DB_NAME = 'insiight';
const DB_URL = `mongodb://${process.env.insiightUser}:${process.env.insiightPw}@ds151863.mlab.com:51863/${DB_NAME}`;

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

  const email = JSON.parse(event.body);
  console.log('payload:');
  console.log(email);

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {

    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(DB_NAME);
    const users = db.collection('users');

    users.findOne(email, function(err, result) {
      if (err) errorResponse(callback, err);

      console.log('Found the following user in the database: ')
      console.log(result);
      
      connection.close();
      successResponse(callback, result);
    });
  });
}