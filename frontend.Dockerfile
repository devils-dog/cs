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

# Устанавливаем скрипт ожидания для backend
RUN echo '#!/bin/sh\n\
set -e\n\
echo "Waiting for backend to become healthy..."\n\
while ! curl -f http://backend:3000/health; do\n\
  echo "Backend is not ready, waiting..."\n\
  sleep 2\n\
done\n\
echo "Backend is healthy, starting nginx"\n\
nginx -g "daemon off;"' > /usr/local/bin/wait-for-backend.sh && \
chmod +x /usr/local/bin/wait-for-backend.sh

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем фронтенд build в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# Запускаем Nginx с проверкой backend
CMD ["/usr/local/bin/wait-for-backend.sh"]