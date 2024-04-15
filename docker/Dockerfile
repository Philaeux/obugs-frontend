### STAGE 1: Build ###
FROM node:21-slim AS build
WORKDIR /obugs
COPY obugs/package.json obugs/package-lock.json .
RUN npm install
COPY ./obugs .
RUN npm run build

### STAGE 2: Run ###
FROM nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /obugs/dist/obugs /usr/share/nginx/html
