import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  // Create uploads directory if it doesn't exist
  if (!existsSync('uploads')) {
    mkdirSync('uploads');
  }
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
