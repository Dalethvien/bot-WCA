FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.lock .

RUN npm i

COPY app app/
COPY index.js .
COPY init.js .

CMD ["npm", "run", "prod"]
