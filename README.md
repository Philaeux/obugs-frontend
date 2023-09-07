# oBugs - Frontend

The oBugs website is using the [Angular](https://angular.io/) framework.
You can work on the project on Windows or Linux (Windows WSL2 is not working properly for project hot reload).

## Development
### Windows
Using Powershell as console. You may require to start as administrator for some commands to work.
* Install `nvm` to manage Node under Windows. You can get the latest version [here](https://github.com/coreybutler/nvm-windows/releases).
* Check that nvm is ready to be used:  
`nvm version`
* Install a running version of node:  
`nvm install lts`
* Set the installed version as the one to use:   
`nvm use lts`
* Check that node is ready to be used:  
`node --version`  
`npm --version`
* Get a copy of the frontend repository:  
`git clone git@github.com:Philaeux/obugs-frontend.git`
* Install angular global library:  
`npm install -g @angular/cli`
* Install project libraries:  
`cd ./obugs; npm install`
* Start the project:  
`cd ./obugs; ng serve --open`

After some time, the browser should display the main page, with hot reload after every change.

### Linux
Using any bash console.  
* Install `nvm` to manage Node under Linux:
```
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
source ~/.profile  
```
* Check that nvm is ready to be used:  
`nvm --version`
* Install a running version of node:  
`nvm install lts`
* Set the installed version as the one to use:   
`nvm use lts`
* Check that node is ready to be used:  
`node --version`  
`npm --version`
* Get a copy of the frontend repository:  
`git clone git@github.com:Philaeux/obugs-frontend.git`
* Install angular global library:  
`npm install -g @angular/cli`
* Install project libraries:  
`cd ./obugs; npm install`
* Start the project:  
`cd ./obugs; ng serve --open`

### Production

## Create output
To turn the angular project into a production ready website, the command `ng build` output the results into `/obugs-frontend/obugs/dist/obugs`

## Deploy
Website will be deployed into a Nginx on a production server.
````
docker compose build
docker compose down
docker compose up -d
``
