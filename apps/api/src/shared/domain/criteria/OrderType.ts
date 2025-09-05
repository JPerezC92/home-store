export enum OrderTypeEnum {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}

export class OrderType {
  constructor(readonly value: OrderTypeEnum) {}

  static fromValue(value: string): OrderType {
    for (const key of Object.keys(OrderTypeEnum)) {
      if (key === value.toUpperCase()) {
        return new OrderType(OrderTypeEnum[key as keyof typeof OrderTypeEnum]);
      }
    }

    return new OrderType(OrderTypeEnum.NONE);
  }

  isNone(): boolean {
    return this.value === OrderTypeEnum.NONE;
  }
}
