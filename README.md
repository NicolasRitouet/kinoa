Kinoa::CRM
=======
[![Codeship.io](https://www.codeship.io/projects/20757/status)](https://www.codeship.io)

## Description

Kinoa is a CRM built with angularJS and Deployd.

## Local use

### Requirements

* [MongoDB is needed](http://docs.mongodb.org/manual/installation/).
* Nodejs
* Gulp installed globally
* Bower installed globally

````bash
git clone https://github.com/NicolasRitouet/kinoa.git
cd kinoa
npm install
bower install
gulp
````
### Create a user
When starting the app for the first time, you'll need to add a user:  

Go to the [Dashboard](http://localhost:3000/dashboard) and create a new user.

Open [http://localhost:3000/](http://localhost:3000/) to use the application.


## TODO

- internationalize Kinoa (because not everybody speaks french!)
- add tests
- add CI with Wercker
- make the CRM more generic (remove tax centers)
