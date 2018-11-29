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
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');

  MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {

    if (err) return errorResponse(callback, err);

    console.log('Database successfully connected.');

    const payload = JSON.parse(event.body);
    const { role } = payload;
    const db = connection.db(DB_NAME);
    const users = db.collection('users');
    const courses = db.collection('courses');

    if (role === 'student') {

      const { email, joinCode } = payload;

      console.log(`Looking for course code: ${joinCode} in database...`);

      // Happy path.. does not check for duplicates
      courses.findOne({ joinCode: joinCode }, function(err, course) {
        if (err) errorResponse(callback, err);

        console.log(`Found course with course code ${joinCode} in the database!`);
        console.log(course);

        const updates = {
          $addToSet: {
            courses: course.joinCode
          }
        };

        users.updateOne({ email: email }, updates, function(err, acknowledge) {

          console.log('Added course to user profile.');

          connection.close();
          successResponse(callback, course);
        });
      });
    }
    else if (role === 'professor') {

      const { name, email, course, school } = payload;
      const joinCode = getNewJoinCode();

      const courseSchema = {
        courseName: course,
        joinCode: joinCode,
        professor: name,
        email: email,
        school: school
      };

      // Happy path.. does not check for duplicates
      courses.insertOne(courseSchema, function(err, result) {
        if (err) errorResponse(callback, err);
        
        console.log('Added the following course to the database: ')
        // see http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
        console.log(result.ops[0]);

        const updates = {
          $addToSet: {
            courses: joinCode
          }
        };

        users.updateOne({ email: email }, updates, function(err, acknowledge) {

          console.log('Added course to user profile.');

          connection.close();
          successResponse(callback, result.ops[0]);
        });
      });
    }
  });
}