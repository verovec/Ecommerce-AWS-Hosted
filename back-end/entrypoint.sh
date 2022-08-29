#!/bin/sh

yarn install
yarn add nodemon

echo "== running app.js =="
nodemon app.js
