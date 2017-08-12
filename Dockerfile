FROM node:latest
COPY app /app
COPY config.json /app/config.json
WORKDIR /app
RUN npm install
CMD ["node","index.js"]
