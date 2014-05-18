Kinoa::CRM
=======
![Codeship.io](https://www.codeship.io/projects/9900cea0-b910-0131-2051-6e04503967cb/status)

## Description

Kinoa is a CRM built with angularJS and Deployd.

## Local use

Deployd is required to make it run. Because of this [bug](https://github.com/deployd/deployd/pull/240), we can't use a deployd custom resource (dpd-fileupload) and some other node moduls (like Gulp), therefore, I made a [fork](https://github.com/NicolasRitouet/deployd/commit/f0c4d45e2edbf5f4df7ac17c8a26d19b8a9aa66c) to fix this issue.  
The package.json uses my fork for deployd.

### Requirements
[MongoDB is needed](http://docs.mongodb.org/manual/installation/).  
A gulp task will start mongodb (on macosx only currently).

````bash
git clone https://github.com/NicolasRitouet/kinoa.git
cd kinoa
npm install
gulp
````
### Create a user
When starting the app for the first time, you'll need to add a user:  

- comment the first line of the file /resources/users/post.js:  
````// cancelUnless(me, "You must be logged in to create a contact", 401);````
- start the app (by running ````gulp````)
- make a post call to this endpoint: ````http://localhost:3000/users```` with these parameters:
````
{
    username: 'yourusername',
    password: 'yourpassword',
    firstname: 'John',
    lastname: 'Doe',
    roles: ["admin"]
}
````
I plan to simplify this process as soon as possible.

Open [http://localhost:3000/](http://localhost:3000/) to use the application.


## TODO

- internationalize Kinoa (because not everybody speaks french!)
- add tests
- add CI with Wercker
- make the CRM more generic (remove tax centers)
