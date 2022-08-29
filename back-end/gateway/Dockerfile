FROM node:16-alpine3.11

WORKDIR '/gateway'

COPY . /gateway

RUN yarn install

ENV GATEWAY_PORT=80

EXPOSE 80

CMD ["yarn", "run", "start" ]
