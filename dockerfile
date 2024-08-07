# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /

# Copia los archivos de configuración de la aplicación
COPY package.json pnpm-lock.yaml ./

# Habilita y prepara corepack y pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.6.0 --activate

# Instala las dependencias de la aplicación
RUN pnpm install --frozen-lockfile

# Copia todos los archivos de la aplicación al contenedor
COPY . .

# Construye el proyecto TypeScript
RUN pnpm run build

# Expone el puerto en el que tu aplicación se ejecuta
EXPOSE 3000

# Define el comando por defecto para ejecutar tu aplicación
CMD ["node", "dist/index.js"]
