import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaginateRequest } from './common.pb';

export class PaginationQueryDto implements PaginateRequest {
    @IsNumber()
    public readonly page: number=1;

    @IsNumber()
    public readonly limit: number=2;
}