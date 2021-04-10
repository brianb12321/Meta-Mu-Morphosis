const path = require('path');

module.exports = {
    devtool: "source-map",
    mode: "development",
    entry: {
        all: './src/main.ts'
    },
    output: {
        filename: 'MMM-[name]-bundle.min.js',
        path: path.resolve(__dirname, 'wwwroot/dist')
    }
};