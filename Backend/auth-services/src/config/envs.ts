import 'dotenv/config';

import * as joi  from 'joi';

interface EnvVars {
    URL_GRPC: string;
    DB_CONNECTION: any;
    DB_HOST: string;
    DB_PORT: number;
    DB_DATABASE: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
}

const envsSchema = joi.object({
    URL_GRPC: joi.string().required(),
    DB_CONNECTION: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_DATABASE: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
})
.unknown(true);

const {error, value} = envsSchema.validate( process.env );

if(error){
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    url_grpc: envVars.URL_GRPC,
    db_connection: envVars.DB_CONNECTION,
    db_host: envVars.DB_HOST,
    db_port: envVars.DB_PORT,
    db_database: envVars.DB_DATABASE,
    db_username: envVars.DB_USERNAME,
    db_password: envVars.DB_PASSWORD
}