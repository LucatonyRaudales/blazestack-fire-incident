FROM node:20-alpine

WORKDIR /app

# Instala deps primero para cache
COPY package.json yarn.lock ./
RUN yarn install

# Copia el resto (en runtime montamos el código con volumes)
COPY . .

EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]
