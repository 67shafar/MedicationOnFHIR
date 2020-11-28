FROM nginx:latest

COPY app /usr/share/nginx/html/app
COPY lib /usr/share/nginx/html/lib
COPY node_modules /usr/share/nginx/html/node_modules
COPY index.html launch.html /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf