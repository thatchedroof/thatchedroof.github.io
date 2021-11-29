"use strict";

var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    filename: 'static/[name].js',
    path: path.resolve(__dirname, '')
  },
  watch: true
};