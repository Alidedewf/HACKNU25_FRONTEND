# ========== STAGE 1: BUILD ==========
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========== STAGE 2: SERVE ==========
FROM nginx:alpine

# копируем сборку React в стандартную директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# добавляем кастомный nginx.conf (если нужно роутинг React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
