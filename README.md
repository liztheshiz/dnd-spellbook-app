# D&D Spellbook App

## Description

This is a simple JavaScript application that uses data from an external API (DnD 5e) and displays named buttons for the user to click to view the spell's details. Alternatively, the user can search for any spell by name in the search bar to view its details.

## Dev instructions

This app is written in vanilla JS and CSS, so files can be opened directly in the browser with no extra building step needed. During development, make sure the html files link to the .css and .js files in the src/ directory rather than dist/. Edit src/ files, minify .css and .js files using [Minify](https://www.minifier.org/) or [Toptal JS](https://www.toptal.com/developers/javascript-minifier)/[Toptal CSS](https://www.toptal.com/developers/cssminifier), replace the .css and .js files in dist/ with the newly minified files, and relink to these files in the html files before deploying.

## Deploy instructions

Merge development branch with gh-pages branch to deploy to GitHub pages.

## Dependencies

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch polyfill
- Promise polyfill
- DnD 5e API

## API

This website loads information directly from the [DnD 5e API](https://www.dnd5eapi.co/docs/#overview--getting-started).