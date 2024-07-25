import MenuItemDto from "../menu/MenuItemDto";
import IngredientDto from "../ingredient/IngredientDto";

interface IMenuItemFoodItemDto {
    menuItem_Id: number;
    foodItem_Id: number;
    consumption: number;
    menuItem: MenuItemDto;
    foodItem: IngredientDto;
}

class MenuItemFoodItemDto implements IMenuItemFoodItemDto {
    consumption: number;
    foodItem: IngredientDto;
    foodItem_Id: number;
    menuItem: MenuItemDto;
    menuItem_Id: number;

    constructor(consumption: number, foodItem: IngredientDto, foodItem_Id: number, menuItem: MenuItemDto, menuItem_Id: number) {
        this.consumption = consumption;
        this.foodItem = foodItem;
        this.foodItem_Id = foodItem_Id;
        this.menuItem = menuItem;
        this.menuItem_Id = menuItem_Id;
    }
}

export default MenuItemFoodItemDto;