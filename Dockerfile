FROM nginxinc/nginx-unprivileged:alpine3.22-slim
ENV BASE_API_URL='http://localhost/api/car-repair-register'
COPY ./init/default.conf /etc/nginx/conf.d/default.conf
COPY ./init/envreplace.sh /docker-entrypoint.d/envreplace.sh
WORKDIR /usr/share/nginx/html/
COPY ./dist/ .
USER root
RUN chown nginx:nginx -R /usr/share/nginx/html/ && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf
USER nginx