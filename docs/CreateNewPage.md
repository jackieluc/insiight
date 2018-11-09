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
    template: './src/pages/about/about.html', # the src HTML file
    inject: true,                             # inject into the HTML file
    chunks: ['about'],                        # the javascript file
    filename: './about/index.html'            # the final file path and file name
}),

```

5. New page is now at: https://localhost:8080/about

## HTML Page Template

```
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-128850591-1"></script>
    <script>
        if (document.location.hostname === 'insiight') {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-128850591-1');
        }
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>InSiight</title>
    <link rel="shortcut icon" type="image/png" href="<%= require('../../assets/logo.jpg') %>" />
    <!-- Twitter Card data -->
    <meta name="twitter:card" value="InSiight">
    <meta name="Description" content="Transforming professor-student feedback interactions for a better educational experience."/>
    <!-- Open Graph data -->
    <meta property="og:title" content="InSiight" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.insiight.ca" />
    <meta property="og:image" content="<%= require('../../assets/logo.jpg') %>" />
    <meta property="og:description" content="Transforming professor-student feedback interactions for a better educational experience." />
    <!-- Mobile header color for Chrome, Firefox OS and Opera -->
    <meta name="theme-color" content="#000000">
    <!-- Mobile header color Windows Phone -->
    <meta name="msapplication-navbutton-color" content="#000000">
    <!-- Mobile header color for iOS Safari (supports black, black-translucent or default) -->
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet">
    <!-- Bootstrap 4 -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <h1>InSiight</h1>
    </div>

    <!-- Bootstrap 4 & jQuery scripts -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>

```