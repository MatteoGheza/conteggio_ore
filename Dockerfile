FROM node:14-alpine as bundler
WORKDIR /usr/src/app
COPY . .
RUN npm install webpack webpack-cli -g; npm install; npm run build; npm prune --production

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=bundler /usr/src/app .
EXPOSE 3000
CMD [ "node", "server.js" ]