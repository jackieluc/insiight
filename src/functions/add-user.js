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

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {

    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const users = db.collection('users');

    // Happy path.. does not check for duplicates
    users.insertOne(payload, function(err, result) {
      if (err) errorResponse(callback, err);
      
      console.log('Added the following user to the database: ')
      // see http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
      console.log(result.ops[0]);
    
      connection.close();
      successResponse(callback, result.ops[0]);
    });
  });
}