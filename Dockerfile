FROM node:22-alpine AS builder
WORKDIR /app

# Install deps (avec patch-package)
COPY package*.json ./
COPY patches ./patches
RUN npm ci --ignore-scripts && npx patch-package

# Build
COPY . .
RUN npm run build

# Stage 2 : serve avec nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
