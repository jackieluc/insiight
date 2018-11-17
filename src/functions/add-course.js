exports.handler = function(event, context, callback) {
  console.log('received request');

  const courseJoinCode = Math.floor((Math.random() * 9999) + 1);

  const payload = JSON.parse(event.body);
  let returnMessage = '';

  if (payload[0].courseCode) {
    returnMessage = `Added course code: ${payload[0].courseCode}`;
  }
  else {
    returnMessage = `Added course ${payload[0].courseName}, your course join code is ${courseJoinCode}`;
  }

  callback(null, {
    statusCode: 200,
    body: returnMessage
  });
}