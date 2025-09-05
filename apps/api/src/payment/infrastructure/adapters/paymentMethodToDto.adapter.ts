import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { PaymentMethodResponseDto } from "#payment/infrastructure/dtos/payment-method-response.dto";

export const paymentMethodToDto = (paymentMethod: PaymentMethod): PaymentMethodResponseDto => {
  return new PaymentMethodResponseDto({
    paymentMethodId: paymentMethod.paymentMethodId,
    name: paymentMethod.name,
    active: paymentMethod.active,
    createdAt: paymentMethod.createdAt,
    updatedAt: paymentMethod.updatedAt
  });
};

export const paymentMethodListToDto = (paymentMethods: PaymentMethod[]): PaymentMethodResponseDto[] => {
  return paymentMethods.map(paymentMethodToDto);
};
