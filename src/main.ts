import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Stellar API')
        .setDescription('API for the Stellar room reservation system')
        .setVersion('1.0.0')
        .addTag('stellar')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
