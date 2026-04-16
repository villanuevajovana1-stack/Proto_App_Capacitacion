# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Archivos de dependencias
COPY package*.json ./

# Instalación
RUN npm install

# Copia del código
COPY . .

# Compilación (Vite generará los archivos estáticos en /dist)
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copiar el build al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# El script lee la variable $PORT que inyecta Railway (o usa 8080 localmente)
# Reemplazamos el puerto por defecto de nginx y lo ejecutamos.
CMD sed -i -e 's/listen *80;/listen '${PORT:-8080}';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
