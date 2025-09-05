import { OrderBy } from "./OrderBy";
import { OrderType, OrderTypeEnum } from "./OrderType";

export class Order {
	constructor(readonly orderBy: OrderBy, readonly orderType: OrderType) {}

	static fromValues(orderBy?: string, orderType?: string): Order {
		if (!orderBy) {
			return Order.none();
		}

		return new Order(
			new OrderBy(orderBy),
			OrderType.fromValue(orderType ?? OrderTypeEnum.ASC)
		);
	}

	static none(): Order {
		return new Order(new OrderBy(""), new OrderType(OrderTypeEnum.NONE));
	}

	isNone(): boolean {
		return this.orderType.isNone();
	}
}
