import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, AuthModule,ConfigModule.forRoot(
    {
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal :true
    }
  )],
  controllers: [],
  providers: [],
})
export class AppModule {}
