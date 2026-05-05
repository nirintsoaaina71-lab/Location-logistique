// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔧 CORS (pour staging, tu peux garder origin: true)
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // 🔥 CORRECTION : Écouter sur 0.0.0.0
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();