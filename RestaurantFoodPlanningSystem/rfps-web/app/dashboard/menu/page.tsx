"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import MenuDto from "../../../lib/models/menu/MenuDto";
import MenuQueryDto from "../../../lib/models/menu/MenuQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {Button, DateInput, Select, SelectItem, Spinner, useDisclosure} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {toast} from "react-toastify";

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

    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<MenuDto>(
        {
            date    : new Date(),
            id      : 0,
            menuItem: {
                id  : 0,
                name: ""
            }
        }
    );
    const [menuItemDto, setMenuItemDto] = useState<MenuItemDto[]>([]);
    const [editModal, setEditModal] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true);
    const menuAPI: string = "/DataManagement/menu";
    const menuItemAPI: string = "/DataManagement/menu-item";
    let menuQueryDto: MenuQueryDto =
        {
            id         : null,
            date       : null,
            menuItem_Id: null
        };
    let newDate: Date;
    let newMenuItemId: number;

    useEffect(() => {
        (async () => {
            try {
                let server_res = await retrieveMenu(menuQueryDto);

                if (!server_res) {
                    showToast("Failed to retrieve menu.");
                    return;
                }

                if (!server_res.isSuccess) {
                    showToast(`Fail - ${server_res.error}`);
                    return;
                }
                
                setMenu(server_res!);
                setHeaders(Object.keys((server_res!.value.resultDto as MenuDto[])[0]));

                let menuItemResponse = await retrieveMenuItem();

                if (!menuItemResponse) {
                    showToast("Failed to retrieve menu item.");
                    return;
                }

                if (!menuItemResponse.isSuccess) {
                    showToast(`Fail - ${menuItemResponse.error}`);
                    return;
                }
                setMenuItemDto(menuItemResponse!.value.resultDto);
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Service crashed.");
                }
            }

        })();
    }, []);

    const showToast = (message: string) => {
        toast(message);
    }

    const handleDelete = (id: number) => {
        (async () => {
            try {
                let server_res = await deleteMenu(id);

                if (!server_res) {
                    showToast("Failed to delete menu.");
                    return;
                }

                if (!server_res.isSuccess) {
                    showToast(`Fail - ${server_res.error}`);
                    return;
                }
                
                let updatedList = await retrieveMenu({
                    id         : null,
                    date       : null,
                    menuItem_Id: null
                });
                setMenu(updatedList!);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Service crashed.");
                }
            }
        })();
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            try {
                let server_res = await retrieveMenu({
                    id         : id,
                    menuItem_Id: null,
                    date       : null
                });

                if (!server_res) {
                    showToast("Failed to retrieve menu for edition.")
                    return;
                }

                if (!server_res.isSuccess) {
                    showToast(`Fail - ${server_res.error}`);
                }
                
                let existingMenu: MenuDto | undefined = (server_res!.value.resultDto as MenuDto[]).pop();

                if (!existingMenu) {
                    showToast("Existing menu is null.");
                    return;
                }

                setEditObj(existingMenu);
                onOpen();

            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Service crashed.");
                }
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
                id      : id,
                date    : date,
                menuItem: menuItem
            });
        } else {
            showToast("Cannot find menu item");
        }
    }

    const updateDate = (date: CalendarDate) => {
        try {
            const {
                id,
                menuItem
            } = editObj;
            setEditObj({
                id      : id,
                menuItem: menuItem,
                date    : date.toDate(getLocalTimeZone())
            });
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const createDate = (date: CalendarDate) => {
        newDate = date.toDate(getLocalTimeZone());
    }

    const createMenuItem = (menuItemId: number) => {
        newMenuItemId = menuItemId;
    }

    const confirmCreation = () => {
        (async () => {
            try {
                let server_response = await insertMenu({
                    id         : null,
                    date       : newDate.toUTCString(),
                    menuItem_Id: newMenuItemId
                });

                if (!server_response) {
                    showToast("Failed to create new menu.");
                    return;
                }

                if (!server_response.isSuccess) {
                    showToast(`Fail - ${server_response.error}`);
                    return;
                }
                
                let retrieveMenuResponse = await retrieveMenu({
                    id         : null,
                    date       : null,
                    menuItem_Id: null
                });

                if (!retrieveMenuResponse) {
                    showToast("Failed to retrieve new menu.");
                    return;
                }

                if (!retrieveMenuResponse.isSuccess) {
                    showToast(`Fail - ${retrieveMenuResponse.error}`);
                }

                setMenu(retrieveMenuResponse!);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
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
            id         : editObj.id,
            date       : editObj.date.toUTCString(),
            menuItem_Id: menuItemId
        };

        (async () => {
            try {
                let server_response = await updateMenu(menuQueryDto);

                if (!server_response) {
                    showToast("Update menu failed");
                    return;
                }

                if (!server_response.isSuccess) {
                    showToast(`Fail - ${server_response.error}`);
                    return;
                }
                let menuReadResponse = await retrieveMenu({
                    id         : null,
                    date       : null,
                    menuItem_Id: null
                });

                if (!menuReadResponse) {
                    showToast("Failed to retrieve updated menu.");
                    return;
                }

                if (!menuReadResponse.isSuccess) {
                    showToast("Retrieve updated menu failed");
                    return;
                }

                setMenu(menuReadResponse!);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })().finally(() => onClose());
    }

    const retrieveMenuItem = async function () {
        try {
            let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, {
                id  : null,
                name: null
            }, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const insertMenu = async function (menuQuery: MenuQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuAPI}/creation`, menuQuery, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const retrieveMenu = async function (menuQuery: MenuQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuAPI}/read`, menuQuery, "POST", token)).json();
            return response as BasicDto<MenuDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const updateMenu = async function (menuQuery: MenuQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuAPI}/update`, menuQuery, "POST", token)).json();
            return response as BasicDto<MenuDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const deleteMenu = async function (id: number) {
        try {
            let response = await (await httpServices.callAPI(`${menuAPI}/${id}`, menuQueryDto, "DELETE", token)).json();
            return response as BasicDto<MenuDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
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

    if (isLoading) {
        return <Spinner/>;
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
                    (menu.value.resultDto as MenuDto[]).map((menuDto) => {

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
                    hideCloseButton={false}
            >
                {
                    renderContent()
                }
            </Modals>
        </>
    );
}