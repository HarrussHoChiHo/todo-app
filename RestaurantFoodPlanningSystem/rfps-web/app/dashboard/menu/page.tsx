"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import MenuQueryDto from "../../../lib/models/menu/MenuQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {Button, DateInput, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {Chelsea_Market} from "next/dist/compiled/@next/font/dist/google";

export default function MenuComponent() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();
    const [menu, setMenu] = useState<BasicDto<MenuDto>>(
        {
            error: "",
            isSuccess: false,
            value: {
                amount: 0,
                resultDto: [{
                    id: 0,
                    date: new Date(),
                    menuItem: {
                        id: 0,
                        name: ""
                    }
                }]
            }
        });

    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<MenuDto>(
        {
            date: new Date(),
            id: 0,
            menuItem: {
                id: 0,
                name: ""
            }
        }
    );
    const [menuItemDto, setMenuItemDto] = useState<MenuItemDto[]>([]);
    const [editModal, setEditModal] = useState<boolean>(true);
    const menuAPI: string = "/DataManagement/menu";
    const menuItemAPI: string = "/DataManagement/menu-item";
    let menuQueryDto: MenuQueryDto =
        {
            id: null,
            date: null,
            menuItem_Id: null
        };
    let newDate: Date;
    let newMenuItemId: number;

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
            let server_res = await deleteMenu(id);
            if (server_res.isSuccess) {
                let updatedList = await retrieveMenu({
                    id: null,
                    date: null,
                    menuItem_Id: null
                });
                setMenu(updatedList);
            } else {
                throw new Error("Failed to delete menu");
            }
        })();
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            let server_res = await retrieveMenu({
                id: id,
                menuItem_Id: null,
                date: null
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

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const updateMenuItem = (selectedOption: number) => {
        const {
            id,
            date
        } = editObj;

        const menuItem = menuItemDto.find((value) => value.id.toString() === selectedOption.toString());
        if (menuItem) {
            setEditObj({
                id: id,
                date: date,
                menuItem: menuItem
            });
        } else {
            throw new Error("Cannot find menu item")
        }
    }

    const updateDate = (date: CalendarDate) => {
        const {
            id,
            menuItem
        } = editObj;
        setEditObj({
            id: id,
            menuItem: menuItem,
            date: date.toDate(getLocalTimeZone())
        });
    }

    const createDate = (date: CalendarDate) => {
        newDate = date.toDate(getLocalTimeZone());
    }

    const createMenuItem = (menuItemId: number) => {
        newMenuItemId = menuItemId;
    }

    const confirmCreation = () => {
        (async () => {
            let server_response = await insertMenu({
                id: null,
                date: newDate,
                menuItem_Id: newMenuItemId
            });
            if (server_response.isSuccess) {
                let retrieveMenuResponse = await retrieveMenu({
                    id: null,
                    date: null,
                    menuItem_Id: null
                });
                if (retrieveMenuResponse.isSuccess) {
                    setMenu(retrieveMenuResponse);
                } else {
                    throw new Error("Failed to retrieve new data.");
                }
            } else {
                throw new Error("Failed to create.");
            }
        })().finally(() => onClose());

    }

    const cancelCreation = () => {
        onClose();
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {
        const menuItemId = editObj.menuItem.id;

        menuQueryDto = {
            id: editObj.id,
            date: editObj.date,
            menuItem_Id: menuItemId
        };

        (async () => {
            let server_response = await updateMenu(menuQueryDto);
            if (server_response.isSuccess) {
                let menuReadResponse = await retrieveMenu({
                    id: null,
                    date: null,
                    menuItem_Id: null
                });
                if (menuReadResponse.isSuccess) {
                    setMenu(menuReadResponse);
                } else {
                    throw new Error("Retrieve updated menu failed");
                }
            } else {
                throw new Error("Update menu failed");
            }
        })().finally(() => onClose());
    }

    const retrieveMenuItem = async function () {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, {
            id: null,
            name: null
        }, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const insertMenu = async function (menuQuery: MenuQueryDto) {
        let response = await (await httpServices.callAPI(`${menuAPI}/creation`, menuQuery, "POST", token)).json();
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

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <DateInput label={"Date"}
                               defaultValue={new CalendarDate(new Date(editObj.date).getFullYear(), new Date(editObj.date).getMonth() + 1, new Date(editObj.date).getDate())}
                               placeholderValue={new CalendarDate(new Date(editObj.date).getFullYear(), new Date(editObj.date).getMonth() + 1, new Date(editObj.date).getDate())}
                               className={"max-w-xs"}
                               onChange={(value) => updateDate(value)}
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
        } else {
            return (
                <>
                    <DateInput label={"Date"}
                               placeholderValue={new CalendarDate(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, new Date().getUTCDate())}
                               className={"max-w-xs"}
                               onChange={(value) => createDate(value)}
                    />
                    <Select
                        label={"Menu Item"}
                        selectionMode={"single"}
                        onSelectionChange={(selection) => createMenuItem(Array.from(selection)[0] as number)}
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
        }
    }

    return (
        <>
            <div className={"w-full flex flex-row justify-end p-2"}>
                <Button variant={"ghost"}
                        startContent={<FontAwesomeIcon icon={faFolderPlus}/>}
                        onClick={handleCreate}
                        className={"w-3/12"}
                />
            </div>
            <div className={"grid grid-cols-5 w-full"}>
                {
                    headers.map((header) => (
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
                                    {`${targetedDate.getFullYear()}-${targetedDate.getMonth() + 1}-${targetedDate.getDate()}`}
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
                    onCancel={() => editModal ? cancelEdition() : cancelCreation()}
                    onConfirm={() => editModal ? confirmEdition() : confirmCreation()}
                    header={editModal ? "Edit" : "Create"}
            >
                {
                    renderContent()
                }
            </Modals>
        </>
    );
}