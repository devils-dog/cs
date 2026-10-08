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

# Экспонируем порт
EXPOSE 5173

# Команда запуска для разработки
CMD ["npm", "run", "dev"]