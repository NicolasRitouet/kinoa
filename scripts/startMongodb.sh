# this script checks if the mongod is running, starts it if not

`ps -A | grep -q '[m]ongod'`

if [ "$?" -eq "0" ]; then
    echo "Mongodb already running"
else
    mongod
fi