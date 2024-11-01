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

        if (exception instanceof HttpException) {
            response.status(exception.getStatus() ?? 500).json(exception.getResponse() ?? '');
        } else {
            response.status(exception.status ?? 500).json(
                {
                    message: exception.message ?? '',
                    statusCode: exception.status ?? 500,
                    error: HttpStatus[exception.status] ?? HttpStatus[500]
                }
            );
        }
    }
}