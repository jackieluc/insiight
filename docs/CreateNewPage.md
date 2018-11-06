# Creating a new page

This is not ideal to create new pages, but before we can optimize this, we can follow this guide in the mean time.

1. Create a new folder in `./src/pages` with the URL you wish to have
* Ex. I want the URL to be `https://www.insiight.ca/about`, so the folder name should be `about`, making the full path   `./src/pages/about`

2. Create or copy a HTML file into the folder and rename the file to have the same name as the folder
* Ex. If folder is `about` then my HTML file is `about.html`

3. Create or copy a JS file into the folder and rename the file to have the same name as the folder
* Ex. If a folder is `about` then my JS file is `about.js`

4. In both [webpack.dev.js](../webpack.dev.js) and [webpack.prod.js](../webpack.prod.js), add the following templated code for Webpack to find the entry point for the JS, so that Webpack knows where to load the JS

* Append `about: './src/pages/about/about.js'` to the `entry` object
```
  entry: {
      home: './src/index.js',
      about: './src/pages/about/about.js'
  },
```

* Append the following in `Plugins` array
```
new HtmlWebpackPlugin({
    template: './src/pages/about/about.html',
    inject: true,
    chunks: ['about'],
    filename: './about/index.html'
}),

```

5. New page is now at: https://localhost:8080/about