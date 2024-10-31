import 'dotenv/config';

import * as joi  from 'joi';

interface EnvVars {
    PORT: number;
    URL_GRPC_AUTH_SERVICE: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    URL_GRPC_AUTH_SERVICE: joi.string().required(),
})
.unknown(true);

const {error, value} = envsSchema.validate( process.env );

if(error){
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    url_grpc_auth_service: envVars.URL_GRPC_AUTH_SERVICE,
}