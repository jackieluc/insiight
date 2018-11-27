# Netlify Functions

See the [docs](https://www.netlify.com/docs/functions/#javascript-lambda-functions) to see how to create a function.

Source function directory: `./src/functions`  
Built function directory: `./functions`

## Running your functions directly

```
npm run start:lambda
```

This will create a local server: http://localhost:9000/{function-name} where `{function-name}` is your function
```
Example:

add-course function becomes http://localhost:9000/add-course
```

## Send and receive data from functions

The URL endpoint for production functions is `./netlify/functions/{function-name}`. 

For convenience in local function development, I created a proxy in [webpack.dev.js](../../webpack.dev.js) that would convert `./netlify/functions/{function-name}` to `http://localhost:9000/{function-name}`

Use the [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)

```
Example:

fetch('/.netlify/functions/add-course', {
  method: "POST",
  body: JSON.stringify({
    text: 'i want to add a course'
  })
})
.then(response => {
  if (!response.ok) {
    return response.text().then(err => {throw(err)});
  }
  // Your response from the Netlify Function is here
  response.text().then(function(result) {
    // do something with the result
  });
})
.catch(err => console.error(err));
```

## MongoDB

Add the following to the top of the `Netlify Function`

```
const { MongoClient } = require('mongodb');

const DB_NAME = 'insiight';
const DB_URL = `mongodb://${process.env.insiightUser}:${process.env.insiightPw}@ds151863.mlab.com:51863/${DB_NAME}`;

// Generic Error Response from the Netlify Function
function errorResponse(callback, err) {
  console.error('END: Error response.');
  console.error(err);

  callback(null, {
    statusCode: 500,
    body: JSON.stringify({ error: err })
  });
};

// Generic Success Response from the Netlify Function
function successResponse(callback, res) {
  console.log('END: Success response.');

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(res)
  });
};
```

Add this inside the `exports.handler` function:

```
MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, connection) {

  if (err) return errorResponse(callback, err);

  console.log('Database successfully connected.');

  const db = connection.db(DB_NAME); // Specify the database we are connecting to
  const courses = db.collection('courses'); // Specify the collection we want

  connection.close(); // Close the connection when done
  successResponse(callback, result.ops[0]); // Return the result of the operation,  find out more about what the result.ops[0] is:  http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
}
```