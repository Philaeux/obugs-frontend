FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY obugs/dist/obugs /usr/share/nginx/html
