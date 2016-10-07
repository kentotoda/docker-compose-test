# Docker Composeのサンプル

## 構成
* Webpack
* nginx
* node.js

Dockerコンテナとしてはnginxとnode.js（APIサーバー）の2つ。Webpackでビルドしたものをnginxで静的配信し、APIへのアクセスをnodeコンテナにフォワードするという構成。

## nodeアプリの起動
ほぼ[この記事](http://postd.cc/lessons-building-node-app-docker/)を参考に。

ポイントは、`Dockerfile`で`npm install`を走らせること。

```Dockerfile
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
```

## ビルド

webpackで`out`ディレクトリにビルドしたモジュールを置く。

```js
module.exports = {
  entry: {
    js: "./client/index.js",
    html: "./client/index.html",
  },  
  output: {
    path: __dirname + "/out",
    filename: 'bundle.js',
  },
}
```

このディレクトリを、`docker-compose.yml`でvolumesとして指定する。これで、nginxコンテナから見えるようになる（`ro` = readonly）。

```yml
nginx-proxy:
  volumes:
    - ./out:/www/app:ro
```

また、linksにnodeコンテナを指定することで、リクエストをフォワードできるようになる。

```yml
nginx-proxy:
  links:
    - 'nodeapp'
```

`default.conf`で、静的ファイルは配信、APIはnodeコンテナにフォワードする（これもvolumesでマウントしている）。
`links`でnodeappを指定しているので、proxy_passの指定はこちらの名前を使用する。

```conf
server {
  listen 8080;
  server_name localhost;

  location /api/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://nodeapp:3000/;
  }

  location / {
    root /www/app;
  }
}
```

## 迷っていること
### Webpackのビルドはどのタイミングが良いのか
本番環境で考えたときに、Push型デプロイならCIでやるだろうし、Pull型デプロイなら`Dockerfile`？
`dev-dependencies`に入れていいのかも微妙。

### ポートの設定とかもっとうまくできないの
例えばnginxだと、`default.conf`に開けるポートを書いて、`docker-compose.yml`にポート書いて、もしAWSに載せるならSecurityGroupでポート開けて、という感じ。変更面倒。

# 参考
- [DockerでのNodeアプリ構築で学んだこと](http://postd.cc/lessons-building-node-app-docker/)


