"use client"
import React, {Fragment, useEffect, useState} from "react";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import {Button, useDisclosure} from "@nextui-org/react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";

export default function MenuItemComponent () {
    const [menuItem, setMenuItem]                 = useState<BasicDto<MenuItemDto>>({
                                                                                        error:     "",
                                                                                        isSuccess: false,
                                                                                        value:     {
                                                                                            amount:    0,
                                                                                            resultDto: [{
                                                                                                id         : 0,
                                                                                                name       : 0,
                                                                                                consumption: 0
                                                                                            }]
                                                                                        }
                                                                                    });
    const [menuItemQueryDto, setMenuItemQueryDto] = useState<MenuItemQueryDto>({id: null, name: null});
    const httpServices                            = new HttpServices();
    const {token}                                 = useAuth();
    const [headers, setHeaders]                   = useState<string[]>([]);
    const {
              isOpen,
              onOpen,
              onClose,
              onOpenChange
          }                                       = useDisclosure();
    const menuItemAPI: string                     = "/DataManagement/menu-item/";

    useEffect(() => {
        (async () => {
            let server_res = await retrieveMenuItem(menuItemQueryDto);

            if (server_res.isSuccess) {
                setMenuItem(server_res);
                setHeaders(Object.keys((server_res.value.resultDto as MenuItemDto[])[0]));
            }
            else {
                console.log(server_res);
            }
        })();
    }, []);

    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const updateMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const deleteMenuItem = async function (id: number) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/${id}`, {}, "DELETE", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const updateMenu = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/update`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuDto>;
    }

    const deleteMenu = async function (id: number) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/${id}`, null, "DELETE", token)).json();
        return response as BasicDto<MenuDto>;
    }

    const handleEdit = (id: number) => {

    }

    const updateMenuObj = () => {

    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {

    }

    const generateMenuItemHeaders = () => {
        return (
            <>
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
            </>
        );
    }

    const generateMenuItemBody = () => {
        return (
            <>
                {
                    (menuItem.value.resultDto as MenuItemDto[]).map((menuItemDto, index) => {
                        return (
                            <Fragment key={`${menuItemDto.name}${menuItemDto.id}`}>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.consumption}
                                </div>
                                {
                                    /*
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(menuItemDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}
                                                         id={menuItemDto.id.toString()}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(menuItemDto.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>
                                </div>
                                */
                                }
                            </Fragment>
                        )
                    })
                }
            </>
        );
    }

    return (<></>);
}