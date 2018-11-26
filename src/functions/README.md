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
  response.text().then(console.log);
})
.catch(err => console.error(err));
```