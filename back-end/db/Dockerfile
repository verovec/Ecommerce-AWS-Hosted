FROM node:16-alpine3.11

WORKDIR /usr/app

ENV PATH /usr/app/node_modules/.bin:$PATH

COPY . /usr/app

ENTRYPOINT [ "./entrypoint.sh" ]
