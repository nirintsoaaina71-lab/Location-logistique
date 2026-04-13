import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadUser } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { MailerService } from 'src/mailer.service';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
   
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async Login(authBody: LoginUserDto) {
    const { email, password } = authBody;
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }
    
    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password
    });
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    
    //  Retourne user ET token
    return this.generateAuthResponse(existingUser);
  }

  async register(registerBody: CreateUserDto) {
    const { email, password, name } = registerBody;
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    
    const hashedPassword = await this.hashPassword(password);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Envoi de l'email DOIT être dans un try/catch pour ne pas bloquer
    // l'inscription si Resend échoue (ex: erreur de sandbox).
    try {
      await this.mailerService.sendMail(email, name);
    } catch(err) {
      const error = err as Error;
      console.error("Erreur lors de l'envoi de l'email:", error.message);
    }
    
    //  Retourne user ET token
    return this.generateAuthResponse(user);
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Pour raison de sécurité, ne pas indiquer que l'email n'existe pas
      return { success: true, message: 'Si un compte existe, un e-mail a été envoyé.' };
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isResetPassword: true,
        resetPasswordToken: resetToken,
      },
    });

    try {
      await this.mailerService.sendPasswordResetMail(user.email, resetToken);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur d'envoi de mail de réinitialisation:", error.message);
    }

    return { success: true, message: 'Si un compte existe, un e-mail a été envoyé.' };
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.isResetPassword) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        isResetPassword: false,
        resetPasswordToken: null,
      },
    });

    return { success: true, message: 'Mot de passe réinitialisé avec succès.' };
  }

  // 🔧 NOUVELLE MÉTHODE : Génère la réponse avec user et token
  private generateAuthResponse(user: any) {
    const payload: PayloadUser = { id: user.id };
    const token = this.jwtService.sign(payload);
    
    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,  // ← Le token sera mis dans le cookie par le controller
    };
  }

  //  NOUVELLE MÉTHODE : Génère uniquement un token (pour refresh)
  async generateToken(userId: string): Promise<string> {
    const payload: PayloadUser = { id: userId };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string) {
    return await hash(password, 10);
  }

  private async isPasswordValid({ password, hashedPassword }: { password: string; hashedPassword: string }) {
    return await compare(password, hashedPassword);
  }
}