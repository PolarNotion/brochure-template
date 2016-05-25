## Polar Notion

> This is a Polar Notion front end project.

## Usage

- Clone this repo
- Run `npm install` to install all necessary dependencies
- Run `gulp start` to start the server and a handful of other tasks

> Note: You shouldn't have to touch anything in the app folder, as everything will be compiled into there. If you do decide to use a router and different style of partials ( if youre using angular, react, or some other framework ) or a single index.html file, open the gulpfile.js and comment or delete lines 72-76, lines 114-116, and line 138 to turn off the html compiler.

## Publishing

To publish the app to ghpages, run
```
git subtree push app origin gh-pages
```

## Assets Installed By Default

- [Normalize CSS](https://necolas.github.io/normalize.css/)

## Assets Setup and ready for use

- [Bootstrap](http://getbootstrap.com/)
- [Font Awesome](https://fortawesome.github.io/Font-Awesome/)

#### How to use them?

At the top of your `main.scss` file, just import any of the following:

```scss
@import "variables";
@import "bootstrap";
@import "font-awesome";
```

## NPM Tools Used

- [Babel](https://babeljs.io/)
- [Browserify](http://browserify.org/)
- [JavaScript Code Style](http://jscs.info/)
- [SASS](http://sass-lang.com/)
- [Mocha](https://mochajs.org/)
- [Chai](http://chaijs.com/)
