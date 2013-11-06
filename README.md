bol-camera
==========

Bits Of Love - Camera prototype

APPLICATION

Install Meteor (if you haven't already).

In your Terminal window, run:

$ curl https://install.meteor.com | sh

Make a copy of the example.

$ meteor create --example camera

Get it running on the cloud.

$ cd camera
$ meteor

to see MongoDB connection run in your Terminal

$ cd camera
$ meteor mongo

SCRAPING

In your Terminal window, run:

$ node scraping.js > camera.json

Import the camera.json file into your MongoDB on localhost
mongoimport -h localhsot:[PORT] -d meteor-c cameras --file camera.json

You are up and running!


