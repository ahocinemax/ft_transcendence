# Node.jsの公式イメージをベースにする
FROM node:20.5.0-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install --save
RUN npm install prisma @prisma/client --save-dev
RUN npm i -g @nestjs/cli

COPY --chown=node:node ./prisma ./prisma
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./tsconfig*.json ./
COPY --chown=node:node .env .env

# distディレクトリを作成
RUN mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app/dist

RUN npx prisma generate
#RUN npx prisma migrate dev --preview-feature
#RUN npx prisma migrate deploy

# アプリケーションを実行
CMD [ "sh", "./start.sh"]
#CMD [ "npm", "run", "start"]


#memo 
#docker exec -it "container ID" /bin/bash
#psql -h postgres -p 5432 -U postgres -d postgres