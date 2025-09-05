import { Income } from "#payment/domain/Income.model";
import { paymentMethodToDto } from "#payment/infrastructure/adapters/paymentMethodToDto.adapter";
import { IncomeResponseDto } from "#payment/infrastructure/dtos/income-response.dto";

export const incomeToDto = (income: Income): IncomeResponseDto => ({
	incomeId: income.incomeId,
	senderName: income.senderName,
	amount: income.amount,
	paymentNote: income.paymentNote,
	transactionDate: income.transactionDate,
	paymentMethod: paymentMethodToDto(income.paymentMethod),
	createdAt: income.createdAt,
	updatedAt: income.updatedAt,
});

export const incomeListToDto = (incomes: Income[]): IncomeResponseDto[] =>
	incomes.map(incomeToDto);
