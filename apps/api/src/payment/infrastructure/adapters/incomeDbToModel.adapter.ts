import {
	IncomeDB as PrismaIncomeDB,
	PaymentMethodDB as PrismaPaymentMethodDB,
} from "#database/infrastructure/prisma/client";
import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";

type IncomeDB = PrismaIncomeDB & {
	PaymentMethodDB?: PrismaPaymentMethodDB;
};

export const incomeDbToModel = (
	incomeDB: IncomeDB,
	paymentMethodDB: PrismaPaymentMethodDB
): Income => {
	const paymentMethod = new PaymentMethod({
		paymentMethodId: paymentMethodDB.payment_method_id,
		name: paymentMethodDB.name,
		active: paymentMethodDB.active,
		createdAt: paymentMethodDB.created_at,
		updatedAt: paymentMethodDB.updated_at,
	});

	return new Income({
		incomeId: incomeDB.income_id,
		senderName: incomeDB.sender_name || "",
		amount: incomeDB.amount,
		paymentNote: incomeDB.payment_note || "",
		transactionDate: incomeDB.transaction_date,
		paymentMethod,
		createdAt: incomeDB.created_at,
		updatedAt: incomeDB.updated_at,
	});
};

export const incomeModelToDB = (income: Income) => ({
	income_id: income.incomeId,
	sender_name: income.senderName,
	amount: income.amount,
	payment_note: income.paymentNote,
	transaction_date: income.transactionDate,
	payment_method_id: income.paymentMethod.paymentMethodId,
	created_at: income.createdAt,
	updated_at: income.updatedAt,
});
