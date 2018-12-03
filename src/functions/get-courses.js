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
  const email = payload.email;

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {
    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(insiightDb);
    const users = db.collection('users');
    const courses = db.collection('courses');

    console.log(`Looking for user with the email: ${email}`);

    users.findOne({ email }, function(err, profile) {
      if (err) return errorResponse(callback, err);
      
      if (!profile) {
        connection.close();
        successResponse(callback, { response: null });
      }

      console.log('Retrieved the profile:');
      console.log(profile);
      const joinCodes = profile.courses;
      console.log(joinCodes);

      // Get all courses for the user
      courses.find({ joinCode: { $in: joinCodes } }).toArray(function(err, result) {

        console.log('Got this list of courses from the database:');
        console.log(result);
          
        connection.close();
        successResponse(callback, { courses: result });
      });
    });
  });
}