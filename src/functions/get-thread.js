const { MongoClient } = require('mongodb');
const { insiightDb, insiightUser, insiightPw } = process.env;
const Moment = require('moment');

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
    const threads = db.collection('threads');

    console.log(payload);

    let result = 'inProgress';

    threads.findOne({ enabled: 'true', joinCode: joinCode }, function(err, thread) {
      if (Moment.now() >= thread.expireTime) {
        console.log('Thread has expired... Setting "enabled" to "false"');

        threads.findOneAndUpdate({ enabled: 'true', joinCode: joinCode }, {enabled: 'false' });
        result = 'expired';
      };

      connection.close();
      successResponse(callback, { result: result });
    });    
  });
}