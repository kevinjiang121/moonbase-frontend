FROM node:slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:slim
WORKDIR /app
COPY --from=build /app/dist/moonbase-frontend ./dist/moonbase-frontend
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm install --only=production
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "dist/moonbase-frontend/server/server.mjs"]
