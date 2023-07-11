# Définir l'image de base
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Compiler l'application
RUN npm run build

# Exposer le port sur lequel l'application va s'exécuter
EXPOSE 8080

# Définir la commande pour démarrer l'application
CMD [ "npm", "run", "start:prod" ]
