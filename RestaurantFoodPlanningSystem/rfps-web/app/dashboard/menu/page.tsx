"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import FoodItemDto from "../../../lib/models/menu/FoodItemDto";
import MenuQueryDto from "../../../lib/models/menu/MenuQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {DateInput, menuItem, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {CalendarDate} from "@internationalized/date";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";

export default function MenuComponent() {
    const httpServices                    = new HttpServices();
    const {token}                         = useAuth();
    const {
              isOpen,
              onOpen,
              onClose,
              onOpenChange
          }                               = useDisclosure();
    const [menu, setMenu] = useState<BasicDto<MenuDto>>(
        {
            error    : "",
            isSuccess: false,
            value    : {
                amount   : 0,
                resultDto: [{
                    id      : 0,
                    date    : new Date(),
                    menuItem: {
                        id  : 0,
                        name: ""
                    }
                }]
            }
        });
    const [foodItem, setFoodItem]         = useState<BasicDto<FoodItemDto>>();
    const [menuQueryDto, setMenuQueryDto] = useState<MenuQueryDto>(
        {
            id         : null,
            date       : null,
            menuItem_Id: null
        });
    const [headers, setHeaders]           = useState<string[]>([]);
    const [editObj, setEditObj] = useState<MenuDto>(
        {
            date    : new Date(),
            id      : 0,
            menuItem: {
                id  : 0,
                name: ""
            }
        });
    const [validDate, setValidDate] = useState<boolean | undefined>(undefined);
    const [menuItemDto, setMenuItemDto] = useState<MenuItemDto[]>([]);
    const menuAPI: string     = "/DataManagement/menu";
    const menuItemAPI: string = "/DataManagement/menu-item";

    useEffect(() => {
        (async () => {
            let server_res = await retrieveMenu(menuQueryDto);

            if (server_res.isSuccess) {
                setMenu(server_res);
                setHeaders(Object.keys((server_res.value.resultDto as MenuDto[])[0]));
            } else {
                console.log(server_res);
            }

            let menuItemResponse = await retrieveMenuItem();

            if (menuItemResponse.isSuccess) {
                setMenuItemDto(menuItemResponse.value.resultDto);
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
        (async () => {
            let server_res = await retrieveMenu({
                id         : id,
                menuItem_Id: null,
                date       : null
            });
            if (server_res.isSuccess) {
                let existingMenu: MenuDto | undefined = (server_res.value.resultDto as MenuDto[]).pop();
                if (existingMenu) {
                    setEditObj(existingMenu);
                    onOpen();
                } else {
                    throw new Error("Existing menu is null.");
                }

            } else {
                throw new Error("failed to retrieve menu with id");
            }
        })();
    }

    const updateMenuItem = (selectedOption: number) => {
        const {id, date} = editObj;
        const menuItem = menuItemDto.find((value, index) => value.id === selectedOption);
        if (menuItem){
            setEditObj({id: id,  date: date,  menuItem: menuItem});
        } else {
            throw new Error("Cannot find menu item")
        }
    }
    
    const updateDate = (date: any) => {
        
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {

    }

    const retrieveMenuItem = async function () {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, {
            id  : null,
            name: null
        }, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
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
                                    {menuDto.menuItem.name}
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
                {
                    (() => {
                        const targetedDate = new Date(editObj.date);
                        const year = targetedDate.getFullYear();
                        const month = targetedDate.getMonth();
                        const day = targetedDate.getDate();
                        
                        return (
                            <>
                                <DateInput label={"Date"}
                                           defaultValue={new CalendarDate(year, month, day)}
                                           placeholderValue={new CalendarDate(year, month, day)}
                                           isInvalid={validDate}
                                           errorMessage={"Please enter a valid date"}
                                           className={"max-w-xs"}
                                />
                                <Select
                                    label={"Menu Item"}
                                    selectionMode={"single"}
                                    selectedKeys={editObj.menuItem.id.toString()}
                                    onSelectionChange={(selection) => updateMenuItem(Array.from(selection)[0] as number)}
                                >
                                    {
                                        menuItemDto.map(value =>
                                            <SelectItem key={value.id} 
                                                        value={value.id}
                                                        textValue={value.name}
                                            >
                                                {value.name}
                                            </SelectItem>
                                        )
                                    }
                                </Select>
                            </>
                        )
                    })()
                }
            </Modals>
        </>
    );
}