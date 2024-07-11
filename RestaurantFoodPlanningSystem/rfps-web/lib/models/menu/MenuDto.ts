import {id} from "postcss-selector-parser";

interface IMenuDto {
    id: number;
    date: Date;
    menuItem_Id: number;
}

class MenuDto implements IMenuDto {
    date: Date;
    id: number;
    menuItem_Id: number;

    constructor(date: Date, id: number, menuItem_Id: number) {
        this.date        = date;
        this.id          = id;
        this.menuItem_Id = menuItem_Id;
    }
}

export default MenuDto;