import { Body, Controller, Inject, OnModuleInit, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthServiceClient, RegisterResponse, RegisterRequest, AUTH_SERVICE_NAME, LoginRequest, LoginResponse } from './auth.pb';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  
  @ApiResponse({
    status: 201,
    type: RegisterResponseDto
  })
  @Post('register')
  private async register(@Body() body: RegisterRequestDto): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  @ApiResponse({
    status: 201,
    type: LoginResponseDto
  })
  @Post('login')
  private async login(@Body() body: LoginRequestDto): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }
}
