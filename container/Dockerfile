# --- ЭТАП 1: СБОРКА (BUILD STAGE) ---
# Используем образ Node.js для установки зависимостей и запуска сборки
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы для управления зависимостями
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код фронтенда
COPY . .

# Запускаем скрипт сборки.
# В результате должна появиться папка 'dist' (или 'build' — проверьте ваш package.json)
RUN npm run build

# --- ЭТАП 2: ПРОДАКШН (PRODUCTION STAGE) ---
# Используем легкий образ Nginx для раздачи статических файлов
FROM nginx:alpine

# Удаляем дефолтный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем кастомный конфиг Nginx (см. ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы из этапа 'builder' в корень Nginx
# Если ваша папка сборки называется 'build', замените 'dist' на 'build'
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx по умолчанию слушает порт 80
EXPOSE 80
