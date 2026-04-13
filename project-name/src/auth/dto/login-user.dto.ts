import { IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class LoginUserDto {
  @IsEmail({},{
    message:"vous devez entrer une email valide"
  })
    email!: string;

  @IsNotEmpty()
  @MinLength(8,{
    message:"votre mot de passe doit contenir au moins 8 caracteres"
  })
    password!: string;

}
