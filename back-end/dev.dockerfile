FROM node:16-alpine3.11

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 4000

ENTRYPOINT [ "/entrypoint.sh" ]
