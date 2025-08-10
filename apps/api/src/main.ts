import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ClassValidatorPipe } from "./shared/infrastructure/pipes/classValidator.pipe";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = "api";

	app.useGlobalPipes(new ClassValidatorPipe());
	app.setGlobalPrefix(globalPrefix);

	const config = new DocumentBuilder()
		.setTitle("Cats example")
		.setDescription("The cats API description")
		.setVersion("1.0")
		.addTag("cats")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document);

	await app.listen(3000);
}

bootstrap();
