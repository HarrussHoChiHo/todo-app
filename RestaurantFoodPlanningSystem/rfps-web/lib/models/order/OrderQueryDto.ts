import {id} from "postcss-selector-parser";

interface IOrderQueryDto {
    id: number | null;
    isCanceled: boolean | null;
}

class OrderQueryDto implements IOrderQueryDto {
    id: number | null;
    isCanceled: boolean | null;

    constructor(id: number | null, isCanceled: boolean | null) {
        this.id = id;
        this.isCanceled = isCanceled;
    }
}

export default OrderQueryDto;