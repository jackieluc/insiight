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
  
  const { joinCode } = JSON.parse(event.body);

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const surveys = db.collection('surveys');
    
    surveys.findOne( { joinCode } , function(err, survey) {
      if (err) return errorResponse(callback, err);

      let temp = JSON.stringify(survey.schema);
      const result = temp.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
        
      console.log(result[0]);
      
      connection.close();
      successResponse(callback, { result });   
    });
  });
}
