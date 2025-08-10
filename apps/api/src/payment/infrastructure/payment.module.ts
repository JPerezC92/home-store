import { Module } from "@nestjs/common";

import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

import { DatabaseModule } from "#database/infrastructure/database.module";

@Module({
	controllers: [PaymentController],
	providers: [PaymentService],
	imports: [DatabaseModule],
})
export class PaymentModule {}
