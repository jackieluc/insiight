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
  const email = payload.email;

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const surveys = db.collection('surveys');
    const users = db.collection('users');

    console.log(payload);

    let result = 'inProgress';

    users.findOne({ email: email, role: 'student' }, function(err, student) {
      if (err) return errorResponse(callback, err);
      console.log(student);

      // Get a list of the student's completed surveys
      const completedSurveys = student.completedSurveys;

      // Find the survey that is enabled, there should only be one
      surveys.findOne({ enabled: 'true', joinCode: joinCode }, function(err, survey) {
        if (err) return errorResponse(callback, err);

        if (survey === null) {
          result = 'none';
        }
        else if (Moment.now() >= survey.expireTime) {
          console.log('Survey has expired... Setting "enabled" to "false"');
  
          surveys.findOneAndUpdate({ enabled: 'true', joinCode: joinCode }, {enabled: 'false' });
          result = 'expired';
        }
        else if (completedSurveys.includes(survey.surveyID)) {
          console.log('Student has already completed this survey.');
          result = 'completed';
        }
  
        connection.close();
        successResponse(callback, { result: result });
      });    
    });
  });
}