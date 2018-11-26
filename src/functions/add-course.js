const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = `mongodb://${process.env.insiightUser}:${process.env.insiightPw}@ds151863.mlab.com:51863/insiight`;

// Database Name
const dbName = 'insiight';

const client = new MongoClient(url, { useNewUrlParser: true });

exports.handler = function(event, context, callback) {
  console.log('received request');

  const courseJoinCode = Math.floor((Math.random() * 9999) + 1);

  let returnObject = {};
  const payload = JSON.parse(event.body);

  if (payload.role === 'student') {
    returnObject.message = `Added course join code: ${payload.courseInfo}`;

    // Use connect method to connect to the Server
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server as a student: join code: " + payload.courseInfo);

      const db = client.db(dbName);
      const courses = db.collection('courses');

      // TODO: can't find the course witht he join code...
      // const c = courses.findOne({ joinCode: payload.courseInfo }, (err) => { console.log(err) });
        
      // returnObject.courseName = c.courseName;
      returnObject.joinCode = payload.courseInfo;

      console.log(returnObject);
    });
    // client.close();
  }
  else {
    returnObject.message = `Added course ${payload.courseInfo}, your course join code is ${courseJoinCode}`;
    returnObject.courseName = payload.courseInfo;
    returnObject.joinCode = courseJoinCode;

    // Use connect method to connect to the Server
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server as a professor");

      const db = client.db(dbName);
      const courses = db.collection('courses');

      // TODO: validate if the course or join code already exists

      courses.insertOne({
        'courseName': payload.courseInfo,
        'joinCode': courseJoinCode,
        'professor': 'n/a'
      }, (err) => console.log(err));
    });
    // client.close();
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(returnObject)
  });
}