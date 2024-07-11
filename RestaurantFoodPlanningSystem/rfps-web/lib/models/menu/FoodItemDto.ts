import {id} from "postcss-selector-parser";

interface IFoodItemDto {
    id: number;
    name: string;
    quantity: number;
    unit_Id: number;
    type_Id: number;
}

class FoodItemDto implements IFoodItemDto {
    id: number;
    name: string;
    quantity: number;
    unit_Id: number;
    type_Id: number;


    constructor(id: number, name: string, quantity: number, unit_Id: number, type_Id: number) {
        this.id       = id;
        this.name     = name;
        this.quantity = quantity;
        this.unit_Id  = unit_Id;
        this.type_Id  = type_Id;
    }
}

export default FoodItemDto;