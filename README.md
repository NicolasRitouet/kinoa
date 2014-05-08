Kinoa::CRM
=======
![Codeship.io](https://www.codeship.io/projects/9900cea0-b910-0131-2051-6e04503967cb/status)

Description
-----------
Kinoa is a CRM built with angularJS and Deployd (currently only in French)

Local use
-----------
Deployd is required to make it run, you can install the binaries here:
http://deployd.com/
It will install deployd globally with an embedded MongoDB.

````bash
git clone https://github.com/NicolasRitouet/kinoa.git
cd kinoa
npm install
dpd -d # Opens the dashboard to add a user
````
To increase the log level, use this command:
````
DEBUG=* dpd -o
````

If you really don't want to install deployd, you can also start the application with nodeJS, but you'll need a running mongoDB with a kinoa DB:
````
npm install
node .
````
Open http://localhost:3000/dashboard to add a user and use the application.


TODO
---
- internationalize Kinoa (because not everybody speaks french!)
- add tests
- add CI with Wercker
- add grunt (or gulps) support: minification and concatenation
- make the CRM more generic (remove tax centers)
