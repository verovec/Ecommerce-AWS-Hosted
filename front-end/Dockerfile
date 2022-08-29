FROM node:16-alpine3.11

WORKDIR /usr/app

ENV PATH /usr/app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY --chown=node:node . .

USER node

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]
