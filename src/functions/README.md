# Netlify Functions

See the [docs](https://www.netlify.com/docs/functions/#javascript-lambda-functions) to see how to create a function.

Source function directory: `./src/functions`  
Built function directory: `./functions`

## Running your functions locally

```
npm run start:lambda
```

This will create a local server: https://localhost:9000/{function-name} where `{function-name}` is your function
```
Example: add-course function becomes https://localhost:9000/add-course
```