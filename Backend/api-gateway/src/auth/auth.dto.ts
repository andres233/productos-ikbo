import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserResponse, ValidateRequest } from './auth.pb';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class LoginResponseDto implements LoginResponse {
  public status: number;
  public error: string[];
  public token: string;
  public user: UserResponse | undefined;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  @IsString()
  public readonly lastname: string;

  @IsString()
  public readonly firstname: string;
}

export class RegisterResponseDto implements RegisterResponse {
  @IsNumber()
  public readonly status: number;

  @IsString()
  public readonly error: string[];
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}
