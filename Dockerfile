FROM node:22 AS builder

WORKDIR /app

COPY front/package*.json ./front/

RUN cd front && npm ci

COPY front/ ./front

RUN cd front && npm run build

FROM node:22

WORKDIR /app

COPY back/package*.json ./back/
RUN cd back && npm ci

COPY back/ ./back/

COPY --from=builder /app/front/dist /app/back/public

WORKDIR /app/back

EXPOSE 5051

CMD ["node", "src/index.js"]