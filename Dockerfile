FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 5173
CMD ["npx", "vitepress", "dev", "docs", "--host", "0.0.0.0", "--port", "5173"]
