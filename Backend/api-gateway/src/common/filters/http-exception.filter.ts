import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { RpcException } from '@nestjs/microservices';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

    console.log(exception)
  
      response.status(exception.status).json({
        statusCode: exception.status,
        message: exception.message,
      });
    }
  }