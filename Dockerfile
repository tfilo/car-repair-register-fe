FROM nginx:stable-alpine
ENV BASE_API_URL='http://localhost/api/car-repair-register'
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./envreplace.sh /docker-entrypoint.d/envreplace.sh
WORKDIR /usr/share/nginx/html/
COPY ./dist/ .
EXPOSE 80
