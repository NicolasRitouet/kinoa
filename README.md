Kinoa::CRM
=======

Description
-----------
Kinoa is a CRM built with angularJS and Deployd.

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

Deployement on a VPS
-------------------
- On a fresh server:
````bash
wget -O install.tar.gz http://github.com/NicolasRitouet/dotfiles/tarball/master --no-check-certificate && tar zxvf install.tar.gz && cd *dotfiles* && ./install.sh
````
- then:
````bash
git clone https://github.com/NicolasRitouet/kinoa.git
cd kinoa
./scripts/vps-install.sh
````
This is going to install:
	- MongoDB (with directories /data/log and /data/db)
	- NodeJS (latest stable)
    	- Set the folder node_modules in $HOME
		- Add node_modules binaries folder to $PATH
	- [install nginx](https://github.com/NicolasRitouet/kinoa/blob/master/scripts/vps-install.sh#L107) and create a config file for kinoa (adapt for hostname)
    - install deployd global
	- install pm2 global
    
Then:
````bash
dpd showkey
````
start mongodb
````bash
mongod --fork --logpath /data/log/mongodb.log
````
- sif following error occurs (
> /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xed) [0x7f2febadd76d])

Execute this:
````bash
export LANGUAGE=en_US.UTF-8 && export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8 && locale-gen en_US.UTF-8 && sudo dpkg-reconfigure locales
````
- start app
````bash
pm2 start index.js
````
- Add a user



TODO
---
- internationalize Kinoa (because not everybody speaks french!)
- add tests
- add grunt (or gulps) support: minification and concatenation
- make the CRM more generic (remove tax centers)