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

/**
 * Generates a random 4 digit 'join code' and convert type to String
 * @returns - String
 */
function getNewJoinCode() {
  return Math.floor((Math.random() * 9999) + 1).toString();
};

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');

  const payload = JSON.parse(event.body);
  const role = payload.role;

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {

    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const db = connection.db(DB_NAME);
    const courses = db.collection('courses');

    if (role === 'student') {

      const joinCode = payload.courseInfo;

      console.log(`Looking for course code: ${joinCode} in database...`);

      // Happy path.. does not check for duplicates
      courses.findOne({ joinCode: joinCode }, function(err, course) {
        if (err) errorResponse(callback, err);

        console.log(`Found course with course code ${joinCode} in the database!`);
        console.log(course);
        
        connection.close();
        successResponse(callback, course);
      });
    }
    else if (role === 'professor') {

      const courseName = payload.courseInfo;
      const courseSchema = {
        'courseName': courseName,
        'joinCode': getNewJoinCode(),
        'professor': 'n/a'
      };

      // Happy path.. does not check for duplicates
      courses.insertOne(courseSchema, function(err, result) {
        if (err) errorResponse(callback, err);
        
        console.log('Added the following course to the database: ')
        // see http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
        console.log(result.ops[0]);
      
        connection.close();
        successResponse(callback, result.ops[0]);
      });
    }
  });
}