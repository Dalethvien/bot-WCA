FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json package-lock.json /

RUN npm i

COPY error.js help.js param.js requestWCA.js wca.js /

CMD ["node", "wca.js"]
