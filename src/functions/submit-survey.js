const { MongoClient } = require('mongodb');
const { insiightDb, insiightUser, insiightPw } = process.env;
const Flatten = require('flat')

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
 * Converts the survey submission object into a flattened JSON structure
 * to be map the data with the database survey schema
 * @param {Object} survey 
 */
function getDataMapping(survey) {
  let data = {};
  Object.keys(survey).forEach(key => {
    data[key] = {};
    data[key][survey[key]] = 1;
  });

  mappedData = Flatten({ schema: data });

  return { $inc: mappedData };
}

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');

  const payload = JSON.parse(event.body);
  const { email, joinCode, survey } = payload;

  console.log(survey);

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const users = db.collection('users');
    const surveys = db.collection('surveys');

    const surveyQuery = { enabled: 'true', joinCode: joinCode };
    const updateAction = getDataMapping(survey);

    surveys.findOneAndUpdate(surveyQuery, updateAction, function(err, result) {
      if (err) errorResponse(callback, err);

      surveys.findOne(surveyQuery, function(err, survey) {
        console.log(`New survey submission for survey ID: ${survey.surveyID}`);

        const completedSurveyUpdate = {
          $addToSet: {
            completedSurveys: survey.surveyID
          }
        };
  
        users.updateOne({ email: email }, completedSurveyUpdate, function(err, acknowledge) {
          console.log('Added completed survey to student profile.');
  
          connection.close();
          successResponse(callback, {'response': 'success'});
        });
      });

    });
  });
}