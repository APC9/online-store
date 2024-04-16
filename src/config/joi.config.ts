/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  //Server Configuration
  PORT: Joi.required().default(3000).error(new Error('PORT IS REQUIRED')),
  PREFIX: Joi.required().default('').error(new Error('PREFIX IS REQUIRED')),
  APP_NAME: Joi.required().error(new Error('APP_NAME IS REQUIRED')),

  // DATA BASE CONFIGURATION
  POSTGRES_DB: Joi.required().error(new Error('DB_NAME IS REQUIRED')),
  POSTGRES_USER: Joi.required().error(new Error('DB_USERNAME IS REQUIRED')),
  POSTGRES_PASSWORD: Joi.required().error(new Error('DB_PASSWORD IS REQUIRED')),
  DB_HOST: Joi.required().default('localhost').error(new Error('IS REQUIRED')),
  DB_PORT: Joi.required().default(5432).error(new Error('DB_HOST IS REQUIRED')),
  DB_REDIS_PORT: Joi.required().default(6379).error(new Error('DB_REDIS_PORT IS REQUIRED')),


  // CLOUDINARY CREDENTIALS
  CLOUDINARY_CLOUD_NAME: Joi.required().error(new Error('CLOUDINARY_CLOUD_NAME IS REQUIRED')),
  CLOUDINARY_API_KEY: Joi.required().error(new Error('CLOUDINARY_API_KEY IS REQUIRED')),
  CLOUDINARY_API_SECRET: Joi.required().error(new Error('CLOUDINARY_API_SECRET IS REQUIRED')), 
  //Servicio de MAILER
  MAILER_TO: Joi.required().error(new Error('MAILER_TO IS REQUIRED')), 
  MAILER_PASSWORD: Joi.required().error(new Error('MAILER_PASSWORD IS REQUIRED')), 

  //JWT SECRET
  JWT_SECRET: Joi.required().error(new Error('JWT_SECRET IS REQUIRED')),

  // GLOOGLE SECRET
  GOOGLE_ID: Joi.required().error(new Error('GOOGLE_ID IS REQUIRED')),
  GOOGLE_SECRET: Joi.required().error(new Error('GOOGLE_SECRET IS REQUIRED')),

  // fACEBOOK SECRET
  FACEBOOK_KEY: Joi.required().error(new Error('FACEBOOK_KEY IS REQUIRED')),
  FACEBOOK_SECRET: Joi.required().error(new Error('FACEBOOK_SECRET IS REQUIRED')),
});
