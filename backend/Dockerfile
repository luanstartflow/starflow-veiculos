FROM node:20-alpine

WORKDIR /app

# 1. Instala todas as dependências (prisma agora está em dependencies)
COPY package*.json ./
RUN npm install

# 2. Gera o Prisma Client antes de copiar o restante
COPY prisma ./prisma/
RUN npx prisma generate

# 3. Copia o código-fonte e compila
COPY . .
RUN npm run build

# 4. Remove devDependencies após o build
RUN npm prune --omit=dev

RUN mkdir -p /app/uploads

EXPOSE 3000

# Apenas inicia — sem depender do CLI do Prisma em runtime
CMD ["node", "dist/main.js"]
