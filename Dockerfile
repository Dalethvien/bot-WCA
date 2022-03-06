FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY error.js .
COPY help.js .
COPY param.js .
COPY requestWCA.js .
COPY wca.js .

CMD ["node", "wca.js"]
