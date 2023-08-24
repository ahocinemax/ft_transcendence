# Utilisez une image de base contenant Node.js
FROM node:lts-alpine

# Définissez le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copiez le package.json et le package-lock.json dans le répertoire de travail
COPY package*.json ./
COPY .env .env

# Installez les dépendances
RUN npm install 

# Copiez le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construisez l'application
RUN npm run build

RUN npm install -g serve

#RUN serve -s build -l 3000

# Exposez le port 3000 sur le conteneur
EXPOSE 3000

# Démarrez l'application lorsque le conteneur est lancé
CMD ["npm", "start"]