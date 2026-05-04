import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MedicamentModule } from './medicament/medicament.module';

@Module({
  imports: [UsersModule, AuthModule,ConfigModule.forRoot(
    {
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal :true
    }
  ), MedicamentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
