# Используем официальный образ Node.js в качестве базы
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Собираем фронтенд
RUN npm run client

# Экспонируем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "server"]