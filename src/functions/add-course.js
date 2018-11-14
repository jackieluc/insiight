exports.handler = function(event, context, callback) {
  console.log('received request');
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
}