FROM --platform=$BUILDPLATFORM node:19-alpine3.15 as dev
RUN mkdir -p /static && chown -R node:node /static
USER node
WORKDIR /app
COPY package.json ./
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM --platform=$BUILDPLATFORM node:19-alpine3.15 as dev-deps
RUN mkdir -p /static && chown -R node:node /static
USER node
WORKDIR /app
COPY package.json package.json
RUN npm install --frozen-lockfile

FROM --platform=$BUILDPLATFORM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM --platform=$BUILDPLATFORM node:19-alpine3.15 as prod-deps
RUN mkdir -p /static && chown -R node:node /static
USER node
WORKDIR /app
COPY package.json package.json
RUN npm install --prod --frozen-lockfile

FROM --platform=$BUILDPLATFORM node:19-alpine3.15 as prod
EXPOSE 3000
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

#La contruccion de la imagen en github-action crea un directorio "dist/src/main.js"
CMD [ "node","dist/src/main.js"]

#CMD [ "node","dist/main.js"]