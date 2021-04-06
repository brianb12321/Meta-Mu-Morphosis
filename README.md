# Meta-mu-morphosis
Meta-mu-morphosis is a fully client-side music and playlist manager.
## Where did you get its name?
* Meta - All your music is self-contained and self-describing. MMM is a comprehensive database for any music knowledge you so choose to store.
* Mu - A play-on-words for music.
* morphosis - MMM is an evolving program. It is fully modular with its bundling and packaging architecture. Based off the suckless methodology, MMM uses Webpack to package all core functionality and plugins into one easy-to-manage Javascript file.
## Building
If you modified MMM or wish to manually build, follow the following steps:
1. Download all necessary packages from NPM:
	npm install
2. Run the build-script.
	::For Windows, run:
	npm run build
	#For Linux, run:
	npm run build-sh
3. Webpack will generate a `MMM-all-bundle.min.js` file in the dist folder. Reference the JS file in `index.html`.