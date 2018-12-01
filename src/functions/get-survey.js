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
    const surveys = db.collection('surveys');

    console.log(payload);

    let result = 'inProgress';

    surveys.findOne({ enabled: 'true', joinCode: joinCode }, function(err, survey) {
      if (Moment.now() >= survey.expireTime) {
        console.log('Survey has expired... Setting "enabled" to "false"');

        surveys.findOneAndUpdate({ enabled: 'true', joinCode: joinCode }, {enabled: 'false' });
        result = 'expired';
      };

      connection.close();
      successResponse(callback, { result: result });
    });    
  });
}