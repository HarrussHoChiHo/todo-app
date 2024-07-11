interface IMenuItemDto {
    menuItem_Id: number;
    foodItem_id: number;
    consumption: number;
}

class MenuItemDto implements IMenuItemDto {
    menuItem_Id: number;
    foodItem_id: number;
    consumption: number;
    
    constructor(menuItem_Id: number, foodItem_id: number, consumption: number) {
        this.menuItem_Id = menuItem_Id;
        this.foodItem_id = foodItem_id;
        this.consumption = consumption;
    }
}

export default MenuItemDto;