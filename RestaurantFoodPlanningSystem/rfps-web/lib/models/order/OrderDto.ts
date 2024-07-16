import OrderItemDto from "./OrderItemDto";

interface IOrderDto {
    id: number;
    isCanceled: boolean;
    orderItems: OrderItemDto[];
}

class OrderDto implements IOrderDto {
    id: number;
    isCanceled: boolean;
    orderItems: OrderItemDto[];

    constructor(id: number, isCanceled: boolean, orderItems: OrderItemDto[]) {
        this.id = id;
        this.isCanceled = isCanceled;
        this.orderItems = orderItems;
    }
}

export default OrderDto;