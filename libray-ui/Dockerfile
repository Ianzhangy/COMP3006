FROM node:20.2.0-alpine3.18 as builder

RUN mkdir app

ADD . /app

RUN cd /app && npm install && npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80