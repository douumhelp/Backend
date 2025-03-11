# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de pacotes
COPY package*.json ./

# Instala as dependências do Node (incluindo nativas como bcrypt)
RUN npm install

# Copia o restante do código fonte
COPY . .

# Construa a aplicação
RUN npm run build

# Expõe a porta
EXPOSE 3000
EXPOSE 3002

# Inicia a aplicação
CMD ["npm", "run", "start:prod"]
