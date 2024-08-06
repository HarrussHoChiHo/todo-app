"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import MenuDto, {menuHeaders, menuHeadersStaff} from "../../../lib/models/menu/MenuDto";
import MenuQueryDto from "../../../lib/models/menu/MenuQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {
    Button,
    DateInput,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {toast} from "react-toastify";

export default function MenuComponent() {
    const httpServices = new HttpServices();
    const {
        token,
        user
    } = useAuth();
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
    const [newMenuItemId, setNewMenuItemId] = useState(0);
    const [newDate, setNewDate] = useState("");
    const menuAPI: string = "/DataManagement/menu";
    const menuItemAPI: string = "/DataManagement/menu-item";
    let menuQueryDto: MenuQueryDto =
        {
            id         : null,
            date       : null,
            menuItem_Id: null
        };

    useEffect(() => {
        (async () => {
            const server_res = await retrieveMenu(menuQueryDto);

            if (!server_res) {
                throw new Error("Failed to retrieve menu.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            setMenu(server_res);

            const menuItemResponse = await retrieveMenuItem();

            if (!menuItemResponse) {
                throw new Error("Failed to retrieve menu item.");
            }

            if (!menuItemResponse.isSuccess) {
                throw new Error(`Fail - ${menuItemResponse.error}`);
            }
            setMenuItemDto(menuItemResponse!.value.resultDto);
            setIsLoading(false);
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
    }, []);

    const showToast = (message: string) => {
        toast(message);
    }

    const handleDelete = (id: number) => {
        (async () => {
            const server_res = await deleteMenu(id);

            if (!server_res) {
                throw new Error("Failed to delete menu.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            const updatedList = await retrieveMenu({
                id         : null,
                date       : null,
                menuItem_Id: null
            });
            setMenu(updatedList!);
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            const server_res = await retrieveMenu({
                id         : id,
                menuItem_Id: null,
                date       : null
            });

            if (!server_res) {
                throw new Error("Failed to retrieve menu for edition.")
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            const [existingMenu] = server_res.value.resultDto;

            setEditObj(existingMenu);
            onOpen();
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
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
        setNewDate(date.toDate(getLocalTimeZone()).toUTCString());
    }

    const createMenuItem = (menuItemId: number) => {
        setNewMenuItemId(menuItemId);
    }

    const confirmCreation = () => {
        (async () => {
            const server_response = await insertMenu({
                id         : null,
                date       : newDate,
                menuItem_Id: newMenuItemId
            });

            if (!server_response) {
                throw new Error("Failed to create new menu.");
            }

            if (!server_response.isSuccess) {
                throw new Error(`Fail - ${server_response.error}`);
            }

            const retrieveMenuResponse = await retrieveMenu({
                id         : null,
                date       : null,
                menuItem_Id: null
            });

            if (!retrieveMenuResponse) {
                throw new Error("Failed to retrieve new menu.");
            }

            if (!retrieveMenuResponse.isSuccess) {
                throw new Error(`Fail - ${retrieveMenuResponse.error}`);
            }

            setMenu(retrieveMenuResponse!);
            onClose()
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });

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
            const server_response = await updateMenu(menuQueryDto);

            if (!server_response) {
                throw new Error("Update menu failed");
            }

            if (!server_response.isSuccess) {
                throw new Error(`Fail - ${server_response.error}`);
            }

            const menuReadResponse = await retrieveMenu({
                id         : null,
                date       : null,
                menuItem_Id: null
            });

            if (!menuReadResponse) {
                throw new Error("Failed to retrieve updated menu.");
            }

            if (!menuReadResponse.isSuccess) {
                throw new Error("Retrieve updated menu failed");
            }

            setMenu(menuReadResponse!);
            onClose();
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });
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
                    <DateInput
                        label={"Date"}
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
                                <SelectItem
                                    key={value.id}
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
                    <DateInput
                        label={"Date"}
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
                                <SelectItem
                                    key={value.id}
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

    const generateOptionalFields = () => {
        if (user?.role.includes("Manager")) {
            return (
                <TableBody emptyContent={"No rows to display."}>
                    {
                        menu.value.resultDto.map((dto) => {
                            const targetedDate = new Date(dto.date);
                            return (
                                <TableRow key={dto.id}>
                                    <TableCell>{dto.id}</TableCell>
                                    <TableCell>{`${targetedDate.getFullYear()}-${targetedDate.getMonth() + 1}-${targetedDate.getDate()}`}</TableCell>
                                    <TableCell>{dto.menuItem.name}</TableCell>
                                    <TableCell width={"30px"}>
                                        <Button
                                            size={"sm"}
                                            onClick={() => handleDelete(dto.id)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                id={dto.id.toString()}
                                            />
                                        </Button>
                                    </TableCell>
                                    <TableCell width={"30px"}>
                                        <Button
                                            size={"sm"}
                                            onClick={() => handleEdit(dto.id)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            );
        } else {
            return (
                <TableBody emptyContent={"No rows to display."}>
                    {
                        menu.value.resultDto.map((dto) => {
                            const targetedDate = new Date(dto.date);
                            return (
                                <TableRow key={dto.id}>
                                    <TableCell>{dto.id}</TableCell>
                                    <TableCell>{`${targetedDate.getFullYear()}-${targetedDate.getMonth() + 1}-${targetedDate.getDate()}`}</TableCell>
                                    <TableCell>{dto.menuItem.name}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            );
        }
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            {
                user?.role.includes("Manager")
                ? (<div className={"w-full flex flex-row justify-end p-2"}>
                    <Button
                        variant={"solid"}
                        startContent={<FontAwesomeIcon icon={faFolderPlus} />}
                        onClick={handleCreate}
                        className={"w-3/12"}
                        color={"success"}
                    />
                </div>)
                : (<></>)
            }
            <Table
                aria-label={"Menu"}
                topContent={<h1 className={"w-full text-center"}>Menu Management</h1>}
            >
                    <TableHeader>
                        {
                            user?.role.includes("Manager")
                            ?
                            menuHeaders.map(tableHeader =>
                                <TableColumn
                                    key={tableHeader.key}
                                >{tableHeader.label}
                                </TableColumn>
                            )
                            : menuHeadersStaff.map(tableHeader =>
                                <TableColumn
                                    key={tableHeader.key}
                                >{tableHeader.label}
                                </TableColumn>)
                        }
                    </TableHeader>
                    {
                        generateOptionalFields()
                    }
                </Table>
                <Modals
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onCancel={() => editModal
                                    ? cancelEdition()
                                    : cancelCreation()}
                    onConfirm={() => editModal
                                     ? confirmEdition()
                                     : confirmCreation()}
                    header={editModal
                            ? "Edit"
                            : "Create"}
                    hideCloseButton={false}
                >
                    {
                        renderContent()
                    }
                </Modals>
        </>
    );
}