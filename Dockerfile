FROM node:4.6.0

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/nodeapp/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/nodeapp
RUN npm install

USER root
COPY . $HOME/nodeapp
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "index.js"]