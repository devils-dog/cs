# Используем официальный образ Node.js в качестве базы
FROM node:18 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Собираем фронтенд для production
RUN npm run build:client

# Используем Nginx для продакшн сервера
FROM nginx:alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем фронтенд build в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# Запускаем Nginx стандартно
CMD ["nginx", "-g", "daemon off;"]