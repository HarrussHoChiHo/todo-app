"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import {useEffect, useState} from "react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import FoodItemDto from "../../../lib/models/menu/FoodItemDto";

export default function MenuComponent(){
    const httpServices          = new HttpServices();
    const {token}               = useAuth();
    const [menu, setMenu] = useState<BasicDto<MenuDto>>();
    const [menuItem, setMenuItem] = useState<BasicDto<MenuItemDto>>();
    const [foodItem, setFoodItem] = useState<BasicDto<FoodItemDto>>();
    const menuAPI: string = "DataManagement/menu";
    const menuItemAPI: string = "DataManagement/menu-item/";
    const foodItemAPI: string = "DataManagement/food-item/";

    // useEffect(() => {
    //     (async () => {
    //         let server_res = await(await httpServices.callAPI(`${menuAPI}/read`, ))
    //     })();
    // }, []);
    
    return (<></>);
}