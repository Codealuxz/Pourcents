FROM node:22-alpine AS builder
WORKDIR /app

# Front : install + patch + build
COPY package*.json ./
COPY patches ./patches
RUN npm ci --ignore-scripts && npx patch-package
COPY . .
RUN npm run build

# Server : install deps prod
WORKDIR /app/server
RUN npm install --omit=dev

# Stage 2 : nginx + node ensemble
FROM nginx:alpine
RUN apk add --no-cache nodejs
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/server /app/server
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 80
CMD ["/start.sh"]
