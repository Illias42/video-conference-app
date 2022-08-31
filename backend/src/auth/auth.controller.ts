import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/decorators';
import { RtGuard } from 'src/guards';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UpdateDto } from './dto';
import { Tokens } from './types';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  signin(@Body() dto: SignUpDto, @UploadedFile() avatar: any): Promise<Tokens> {
    return this.authService.signup(dto, avatar);
  }

  @Post('/local/signin')
  signup(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @Post('/local/update')
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Body() dto: UpdateDto, @UploadedFile() avatar: any): Promise<any> {
    return this.authService.update(dto, avatar);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  login(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string 
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  @Post('/logout')
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }
}
