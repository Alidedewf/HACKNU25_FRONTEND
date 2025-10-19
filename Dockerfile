# ========== STAGE 1: BUILD ==========
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ========== STAGE 2: SERVE ==========
FROM nginx:alpine

# Копируем сборку React в стандартную директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем nginx-конфиг (SPA-роутинг)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
