import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/infrastructure/drizzle-database.module";
import { TasksModule } from "./tasks/infrastructure/tasks.module";
import { TransactionsModule } from "./transactions/infrastructure/transactions.module";

@Module({
	imports: [DatabaseModule, TasksModule, TransactionsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
