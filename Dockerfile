FROM node:14-alpine as bundler
WORKDIR /usr/src/app
COPY . .
RUN npm install webpack webpack-cli -g; npm install
RUN npm run build
EXPOSE 3000
CMD [ "node", "server.js" ]

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=bundler /usr/src/app/dist ./dist
RUN npm install --only=prod
EXPOSE 3000
CMD [ "node", "server.js" ]