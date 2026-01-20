FROM node:18 AS build
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . ./
ARG version
ENV VUE_APP_VERSION=$version
RUN npm run build

FROM nginx:latest
COPY --from=build /build/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
