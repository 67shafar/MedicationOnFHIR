FROM nginx:latest

COPY app /usr/share/nginx/html/app
COPY lib /usr/share/nginx/html/lib
COPY node_modules /usr/share/nginx/html/node_modules
COPY index.html launch.html /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

RUN openssl req -x509 -nodes -days 365 -subj "/C=CA/ST=QC/O=Company, Inc./CN=*" -addext "subjectAltName=DNS:*" -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt;