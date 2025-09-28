# Usa una imagen base de Nginx ligera
FROM nginx:alpine

# Copia los archivos estáticos de la aplicación al directorio de Nginx
COPY index.html /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html
COPY app.js /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# El comando por defecto de Nginx ya se encarga de iniciar el servidor
