# MuMetaMorph
MuMetaMorph is a fully client-side music and playlist manager.
## Where did you get its name?
* Mu - A play-on-word for music.
* Meta - All your music is self-contained and self-describing. MMM is a comprehensive database for any music knowledge you so choose to store.
* Morph - MMM is an evolving program. It is fully modular with its bundling and packaging architecture. Based off the suckless methodology, MMM uses Webpack to package all core functionality and plugins into one easy-to-manage Javascript file.

# Images
![Home Page]()

## Building
If you modified MMM or wish to manually build, follow the following steps:
1. Change to `package.json` directory.
2. Download all necessary packages from NPM:
```
$ npm install
```
3. Run the build-script.
```
::For Windows, run:
> npm run build
#For Linux, run:
$ npm run build-sh
```
4. Webpack will generate a `MMM-all-bundle.min.js` file in the wwwroot/dist folder. Reference the JS file in `index.html` for your webserver.
5. To run the included webserver:
```
$ dotnet build
$ dotnet run
```
## Running VSCode Live Server
If you are running VSCode live server, please update your `Settings.json` webserver root path to the `wwwroot` directory.
## Theme not loading
If the default theme is not loading, please edit the global default theme variables in `src/defaults.ts` for your specific webserver and delete the database.
## Demo Site
A demo site with default plugins can be found at https://mu-meta-morph.web.app
## Next Steps
I will be converting this project into an Angular application called Neo-MuMetaMorph
