FROM node:18.18.0-alpine3.18

RUN mkdir app

ADD . /app

WORKDIR /app

RUN npm install 

EXPOSE 5001

ENTRYPOINT ["npm", "run", "start"]