import { 
  Body, Controller, Get, Post, Request, UseGuards, 
  Res, HttpStatus 
} from '@nestjs/common';
import express from 'express'; 
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as jwtStrategy from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('login')
  async Login(
    @Body() authBody: LoginUserDto,
    @Res({ passthrough: true }) res: express.Response,  // ← AJOUTER
  ) {
    const result = await this.authService.Login(authBody);
    
    //  CRÉER LE COOKIE HTTP-ONLY
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/',
    });
    
    // Retourner l'utilisateur (sans le token)
    return { user: result.user };
  }


  @Post('register')
  async register(
    @Body() registerBody: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,  // ← AJOUTER
  ) {
    const result = await this.authService.register(registerBody);
    
    //  CRÉER LE COOKIE HTTP-ONLY
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    
    // Retourner l'utilisateur
    return { user: result.user };
  }

 
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: express.Response,
  ) {
    // SUPPRIMER LE COOKIE
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    
    return { success: true, message: 'Déconnexion réussie' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(
    @Request() req: jwtStrategy.RequestWithUser,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    // Générer un nouveau token
    const newToken = await this.authService.generateToken(req.user.id);
    
    // Mettre à jour le cookie
    res.cookie('access_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async AuthenticateUser(@Request() req: jwtStrategy.RequestWithUser) {
    return await this.userService.getUser({ id: req.user.id });
  }
}