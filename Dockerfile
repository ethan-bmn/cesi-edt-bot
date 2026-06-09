FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun i -D

RUN bunx puppeteer browsers install chrome


CMD ["bun", "run", "src/index.ts"]
