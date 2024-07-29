interface IMenuItemDto {
    id: number;
    name: string;
}

export const menuItemHeaders = ["ID", "Name"];

class MenuItemDto implements IMenuItemDto {
    id: number;
    name: string;
    
    constructor(menuItem_Id: number, name: string) {
        this.id = menuItem_Id;
        this.name = name;
    }
}

export default MenuItemDto;