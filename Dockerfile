FROM node:4.6.0

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/chat/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/chat
RUN npm install

USER root
COPY . $HOME/chat
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "index.js"]