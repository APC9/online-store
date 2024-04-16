<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# API ONLINE STORE

1. Clonar el repositorio
2. Ejecutar

```
 npm install 
```
3. Tener Nest CLI instalado

```
 npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
 docker-compose up -d
```

5. variables de entorno definidas en el __env/development.env__

6. Ejecutar la aplicacion en dev:

```
npm run start:dev
```


# Documentacion 
## documentacion de los Endpoint en: 

```
http://localhost:3000/api/v1/docs
```


## Stack usado
* PostgreSQL
* Redis
* Nestjs
* Docker
* Swagger


## GitHub Action Docker Build and Push
Crear tag
```
v*.*.*
```

Git push follow tags para genera la contruccion de la imagen