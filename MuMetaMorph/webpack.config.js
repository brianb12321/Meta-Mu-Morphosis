const path = require('path');

module.exports = {
    devtool: "source-map",
    mode: "production",
    entry: {
        all: './src/_build/main.js'
    },
    output: {
        filename: 'MMM-[name]-bundle.min.js',
        path: path.resolve(__dirname, 'wwwroot/dist')
    }
};