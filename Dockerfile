# Этот Dockerfile предназначен для Node.js приложения с Express и React
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Собираем бэкенд
RUN npm run build:server

# Создаем директорию для логов
RUN mkdir -p logs

# Экспонируем порт
EXPOSE 3000

# Запускаем сервер с логированием
CMD ["npm", "start"]