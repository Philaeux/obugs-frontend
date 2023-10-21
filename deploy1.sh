#!/bin/bash

cd obugs 
npm install
ng build --configuration production
tar -czvf dist.tar.gz dist/
scp dist.tar.gz philaeux@luna.the-cluster.org:~/obugs-frontend/obugs/dist.tar.gz
rm -rf dist.tar.gz
cd ..
ssh philaeux@luna.the-cluster.org
