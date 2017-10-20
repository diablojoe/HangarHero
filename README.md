## Setting up the server

#### Install Go

https://github.com/moovweb/gvm


`bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)`

`gvm install -B go1.9`

`gvm use go1.9`

#### Install bee (optional)


`go get github.com/beego/bee`

#### Install Docker

https://www.docker.com/community-edition

#### Run My-SQL

`docker pull mysql`
```
sudo docker run -d --name=test-mysql -p 3306:3306 -e "MYSQL_ROOT_PASSWORD=mypassword" -e "MYSQL_DATABASE=hangar" -e "MYSQL_USER=Hangar" -e "MYSQL_PASSWORD=Hero" mysql:latest
```
#### Run HH server

`bee run`
