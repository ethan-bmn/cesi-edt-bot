FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun i -D


CMD ["bun", "run", "src/index.ts"]
