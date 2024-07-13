interface IMenuItemDto {
    id: number;
    name: string;
}

class MenuItemDto implements IMenuItemDto {
    id: number;
    name: string;
    
    constructor(menuItem_Id: number, name: string) {
        this.id = menuItem_Id;
        this.name = name;
    }
}

export default MenuItemDto;