"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import FoodItemDto from "../../../lib/models/menu/FoodItemDto";
import MenuQueryDto from "../../../lib/models/menu/MenuQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {Button, useDisclosure} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";

export default function MenuComponent() {
    const httpServices                    = new HttpServices();
    const {token}                         = useAuth();
    const {
              isOpen,
              onOpen,
              onClose,
              onOpenChange
          }                               = useDisclosure();
    const [menu, setMenu]                 = useState<BasicDto<MenuDto>>({
                                                                            error    : "",
                                                                            isSuccess: false,
                                                                            value    : {
                                                                                amount   : 0,
                                                                                resultDto: [{
                                                                                    id         : 0,
                                                                                    menuItem_Id: 0,
                                                                                    date       : new Date()
                                                                                }]

                                                                            }
                                                                        });
    const [menuItem, setMenuItem]         = useState<BasicDto<MenuItemDto>>({
                                                                                error    : "",
                                                                                isSuccess: false,
                                                                                value    : {
                                                                                    amount   : 0,
                                                                                    resultDto: [{
                                                                                        menuItem_Id: 0,
                                                                                        foodItem_id: 0,
                                                                                        consumption: 0
                                                                                    }]
                                                                                }
                                                                            });
    const [foodItem, setFoodItem]         = useState<BasicDto<FoodItemDto>>();
    const [menuQueryDto, setMenuQueryDto] = useState<MenuQueryDto>({
                                                                       id         : null,
                                                                       date       : null,
                                                                       menuItem_Id: null
                                                                   });
    const [headers, setHeaders]           = useState<string[]>([]);

    const menuAPI: string     = "/DataManagement/menu";
    const menuItemAPI: string = "/DataManagement/menu-item/";
    const foodItemAPI: string = "/DataManagement/food-item/";

    useEffect(() => {
        (async () => {
            let server_res = await retrieveMenu(menuQueryDto);

            if (server_res.isSuccess) {
                setMenu(server_res);
                setHeaders(Object.keys((server_res.value.resultDto as MenuDto[])[0]));
            } else {
                console.log(server_res);
            }
        })();
    }, []);

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await (await httpServices.callAPI(`${menuAPI}/${id}`, null, "DELETE", token)).json() as BasicDto<MenuDto>;
            if (server_res.isSuccess) {
                setMenu(server_res);
                setMenuQueryDto({
                                    id         : null,
                                    date       : null,
                                    menuItem_Id: null
                                });
                let updatedList = await retrieveMenu(menuQueryDto);
                setMenu(updatedList);
            } else {
                throw new Error("Failed to delete menu");
            }


        })();
    }

    const handleEdit = (id: number) => {

    }

    const updateMenuObj = () => {

    }

    const openMenuItem = (id: number) => {
        (async () => {
            let server_res = await retrieveMenuItem({
                                                        id  : id,
                                                        name: null
                                                    });
            if (server_res.isSuccess){
                setMenuItem(server_res);
            } else {
                throw new Error("Failed to retrieve menu item")
            }
            
        })();
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {
        
    }


    const retrieveMenu = async function (menuQuery: MenuQueryDto) {
        let response = await (await httpServices.callAPI(`${menuAPI}/read`, menuQuery, "POST", token)).json();
        return response as BasicDto<MenuDto>;
    }

    const updateMenu = async function (menuQuery: MenuQueryDto) {
        let response = await (await httpServices.callAPI(`${menuAPI}/update`, menuQuery, "POST", token)).json();
        return response as BasicDto<MenuDto>;
    }

    const deleteMenu = async function (id: number) {
        let response = await (await httpServices.callAPI(`${menuAPI}/${id}`, menuQueryDto, "DELETE", token)).json();
        return response as BasicDto<MenuDto>;
    }

    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const updateMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const deleteMenuItem = async function (id: number) {
        let response = await (await httpServices.callAPI(`${menuAPI}/${id}`, {}, "DELETE", token)).json();
        return response as BasicDto<MenuDto>;
    }

    return (
        <>
            <div className={"grid grid-cols-5"}>
                {
                    headers.map((header, index) => (
                        <Fragment key={header}>
                            <div className={"font-extrabold gird-style text-center"}>
                                {header}
                            </div>
                        </Fragment>
                    ))
                }
                <Fragment key={"header_delete"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Delete
                    </div>
                </Fragment>
                <Fragment key={"header_edit"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Edit
                    </div>
                </Fragment>
                {
                    (menu.value.resultDto as MenuDto[]).map((menuDto, index) => {
                        const targetedDate = new Date(menuDto.date);
                        return (
                            <Fragment key={menuDto.id}>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {`${targetedDate.getFullYear()}-${targetedDate.getMonth()}-${targetedDate.getDate()}`}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <Button onClick={() => openMenuItem(menuDto.menuItem_Id)}>{menuDto.menuItem_Id}</Button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(menuDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}
                                                         id={menuDto.id.toString()}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(menuDto.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
            <Modals isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onCancel={cancelEdition}
                    onConfirm={confirmEdition}
            >
                <></>
            </Modals>
        </>
    );
}