import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { join } from 'path';
import { contentParser } from 'fastify-file-interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ maxParamLength: 300 }), // maxParamLength: para poder enviar JWT por los params
  );

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(process.env.PREFIX);

  //constenido estatico
  app.useStaticAssets({
    root: join(__dirname, '.', 'public'),
    prefix: '/public/',
  });

  //Vistas de templates hbs
  //En el package.json = "build": "nest build && cp -r views dist/views",
  const isProduction = process.env.NODE_ENV === 'production';
  const templatesPath = isProduction
    ? join(__dirname, '.', 'views')
    : join(__dirname, '..', 'views');

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: templatesPath,
  });

  //Para la  subida de archivos con fastify
  app.register(contentParser);

  //Habilitar cors
  app.enableCors();

  //IMPORTANT: esta configuracion en necesaria para usar passport con fastify
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', (request, reply, done) => {
      reply['setHeader'] = function (key, value) {
        return this.raw.setHeader(key, value);
      };
      reply['end'] = function () {
        this.raw.end();
      };
      request['res'] = reply;
      done();
    });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API ONLINE STORE')
    .setDescription(
      'Set of endpoints to interact with resources related to the online store',
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${configService.get('PORT')}`, 'localhost')
    .addServer('https://production.yourapi.com/', 'Production')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${configService.get('PREFIX')}/docs`, app, document);

  //Con Fastify en necesario agregar, '0.0.0.0' para poder conectarse en docker
  await app.listen(configService.get('PORT'), '0.0.0.0');
  Logger.log(
    `APP running in mode: ${isProduction ? 'production' : 'development'}`,
  );
  Logger.log(`App running on port ${configService.get('PORT')} `);
}
bootstrap();
