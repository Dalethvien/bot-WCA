FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.js .

RUN npm i

COPY error.js wca.js help.js param.js requestWCA.js /

CMD ["node", "wca.js"]
