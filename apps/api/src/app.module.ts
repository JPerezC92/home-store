import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/infrastructure/database.module";
import { LinksModule } from "./links/links.module";

@Module({
	imports: [LinksModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
