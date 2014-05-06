export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
locale-gen en_US.UTF-8
sudo dpkg-reconfigure locale

echo -e "VPS - Kinoa Install"
echo -e "Install mongoDB, bind_ip to 127.0.0.1, small_files=true"
echo -e "Install nodejs, add path to .bashpath, install npm, add path, set node_modules global and add bin in path"
echo -e "install pm2 globally, deployd"
echo -e "npm install"
echo -e "install nginx"

function start {
  # Ask If Install MongoDB
  echo -n "Do you wish to install MongoDB? (Y/n): "
  read -e OPTION_MONGODB
  # Check User Input
  if [ "$OPTION_MONGODB" != "n" ]; then
    # Execute Function
    install_mongodb
  fi

  # Ask If Install nodeJS
  echo -n "Do you wish to install NodeJs? (Y/n): "
  read -e OPTION_NODEJS
  # Check User Input
  if [ "$OPTION_NODEJS" != "n" ]; then
    # Execute Function
    install_nodejs
  fi

  # Ask If Install Deployd globally
  echo -n "Do you wish to install Deployd globally? (Y/n): "
  read -e OPTION_DEPLOYD
  # Check User Input
  if [ "$OPTION_DEPLOYD" != "n" ]; then
    # Execute Function
    npm install -g deployd
  fi

  # Ask If Install pm2 globally
  echo -n "Do you wish to install pm2 globally? (Y/n): "
  read -e OPTION_PM2
  # Check User Input
  if [ "$OPTION_PM2" != "n" ]; then
    # Execute Function
    npm install -g pm2
  fi
  
  echo -e "npm install"
  npm install


  # Ask If Install nginx globally
  echo -n "Do you wish to install nginx? (Y/n): "
  read -e OPTION_NGINX
  # Check User Input
  if [ "$OPTION_NGINX" != "n" ]; then
    # Execute Functions

    echo -n "Please, enter your hostname "
    read hostname
    install_nginx
  fi

  # Ask If reboot
  echo -n "Do you wish to reboot? (Y/n): "
  read -e OPTION_REBOOT
  # Check User Input
  if [ "$OPTION_REBOOT" != "n" ]; then
    # Execute Function
    sudo reboot
  fi
 }


function install_mongodb {
	sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
	echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee -a /etc/apt/sources.list.d/10gen.list
	sudo apt-get -y update
	sudo apt-get -y install mongodb-10gen
	echo 'bind_ip = 127.0.0.1' | sudo tee -a /etc/mongodb.conf
	echo "smallfiles = true" | sudo tee -a /etc/mongodb.conf
    sudo mkdir /data
    sudo chown Nicolas:Nicolas /data
    mkdir /data/db
    mkdir /data/log
    sudo chown Nicolas:Nicolas /data/db
    sudo chown Nicolas:Nicolas /data/log
}


function install_nodejs {
        
	# Install nodeJS
	sudo apt-get install -y python-software-properties python g++ make
	sudo add-apt-repository -y ppa:chris-lea/node.js
	sudo apt-get -y update
	sudo apt-get -y install nodejs
	# Change the globaly node_modules folder
	npm config set prefix $HOME/.node_modules
	echo 'export PATH=~/.node_modules/bin:$PATH' >> ~/.bash_path
}

function install_nginx {
  # Install nginx
  sudo apt-get install -y nginx
  # Back up the default config file
  mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
  # Create a new config file for Kinoa
sudo bash -c "cat > /etc/nginx/conf.d/$hostname.conf <<EOL
server {
  listen 80;

  server_name $hostname;
  client_max_body_size 60M;

  location / {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host \$host;
      proxy_cache_bypass \$http_upgrade;
  }
}
EOL"
  # uncomment hash_bucket_size in nginx.conf
  sudo perl -pi -e "s/# server_names_hash_bucket_size 64;/server_names_hash_bucket_size 64;/g" /etc/nginx/nginx.conf
  sudo service nginx restart
  echo -e "nginx install done on $hostname !"

}

 start
