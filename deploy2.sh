#!/bin/bash

git pull
cd obugs && ng build --configuration production
tar -czvf dist.tar.gz dist/
scp dist.tar.gz philaeux@luna.the-cluster.org:~/obugs-frontend/dist.tar.gz
ssh philaeux@luna.the-cluster.org
