// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';  // ← Utiliser import * as

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔧 1. D'abord configurer CORS
   app.enableCors({
  origin: true,  // Accepte toutes les origines (⚠️ pas pour production)
  credentials: true,
});
  
  // 🔧 2. Ensuite les middlewares
  app.use(cookieParser());
  
  // 🔧 3. Enfin les pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();