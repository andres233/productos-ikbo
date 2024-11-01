import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateInventoryRequestDto {
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    public readonly quantity: number;

    @IsNotEmpty() 
    @IsDateString()
    public readonly expiredAt: string;
}

export class CreateInventoryResponseDto {
    public readonly quantity: number;
    public readonly expiredAt: string;
}
