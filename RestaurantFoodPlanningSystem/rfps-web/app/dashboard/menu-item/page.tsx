"use client"
import React, {Fragment, useEffect, useState} from "react";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import {Button, Input, useDisclosure} from "@nextui-org/react";
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import Modals from "../../../components/CustomModal";

export default function MenuItemComponent() {

    useEffect(() => {
        (async () => {
            let server_res = await retrieveMenuItem(menuItemQueryDto);

            if (server_res.isSuccess) {
                setMenuItem(server_res);
                setHeaders(Object.keys((server_res.value.resultDto as MenuItemDto[])[0]));
            } else {
                console.log(server_res);
            }
        })();
    }, []);

    const [menuItem, setMenuItem] = useState<BasicDto<MenuItemDto>>(
        {
            error: "",
            isSuccess: false,
            value: {
                amount: 0,
                resultDto: [{
                    id: 0,
                    name: ""
                }]
            }
        });
    const [menuItemQueryDto, setMenuItemQueryDto] = useState<MenuItemQueryDto>(
        {
            id: null,
            name: null
        });
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<MenuItemDto>(
        {
            id: 0,
            name: ""
        }
    );
    const [editModal, setEditModal] = useState(true);
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();
    const menuItemAPI: string = "/DataManagement/menu-item";
    let newName: string;

    const createMenuItem = async function () {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/creation`, {
            id: null,
            name: newName
        }, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const updateMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/update`, menuItemQuery, "POST", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const deleteMenuItem = async function (id: number) {
        let response = await (await httpServices.callAPI(`${menuItemAPI}/${id}`, {}, "DELETE", token)).json();
        return response as BasicDto<MenuItemDto>;
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            let server_res = await retrieveMenuItem({
                id: id,
                name: null
            });
            if (server_res.isSuccess) {
                let existingMenuItem: MenuItemDto | undefined = (server_res.value.resultDto as MenuItemDto[]).pop();
                if (existingMenuItem) {
                    setEditObj(existingMenuItem);
                } else {
                    throw new Error("Existing menu is null.");
                }
            } else {
                throw new Error("failed to retrieve menu with id");
            }
        })().finally(() => onOpen());
    }

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await deleteMenuItem(id);
            if (server_res.isSuccess) {
                let updatedList = await retrieveMenuItem({
                    id: null,
                    name: null
                });
                setMenuItem(updatedList);
            } else {
                throw new Error("Failed to delete menu");
            }
        })();
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const insertName = (name: string) => {
        const {id} = editObj;
        setEditObj({
            id: id,
            name: name
        });
    }

    const createName = (name: string) => {
        newName = name;
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {
        const {id} = editObj;

        (async () => {
            let server_response = await updateMenuItem({
                id: id,
                name: newName
            });
            if (server_response.isSuccess) {
                let menuReadResponse = await retrieveMenuItem({
                    id: null,
                    name: null
                });
                if (menuReadResponse.isSuccess) {
                    setMenuItem(menuReadResponse);
                } else {
                    throw new Error("Retrieve updated menu failed");
                }
            } else {
                throw new Error("Update menu failed");
            }
        })().finally(() => onClose());
    }

    const cancelCreation = () => {
        onClose();
    }

    const confirmCreation = () => {
        (async () => {
            let server_res = await createMenuItem();
            if (server_res.isSuccess) {
                let updatedMenuItemResponse = await retrieveMenuItem({
                    id: null,
                    name: null
                });

                if (updatedMenuItemResponse.isSuccess) {
                    setMenuItem(updatedMenuItemResponse);
                } else {
                    throw new Error("Failed to create new menu item");
                }

            }
        })().finally(() => onClose());
    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <Input label={"Name"}
                           placeholder={editObj.name}
                           defaultValue={editObj.name}
                           onValueChange={(name) => insertName(name)}
                    />
                </>
            )
        } else {
            return (
                <>
                    <Input label={"Name"}
                           placeholder={"Insert a name"}
                           onInput={(event) => createName(event.currentTarget.value)}
                           onValueChange={(value) => createName(value)}
                           onChange={(value) => createName(value.target.value)}
                    />
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
            <div className={"grid grid-cols-4 w-full"}>
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
                    (menuItem.value.resultDto as MenuItemDto[]).map((menuItemDto, index) => {
                        return (
                            <Fragment key={`${menuItemDto.name}${menuItemDto.id}`}>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(menuItemDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(menuItemDto.id)}>
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