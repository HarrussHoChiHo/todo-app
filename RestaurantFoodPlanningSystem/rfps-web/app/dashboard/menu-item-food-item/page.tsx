"use client"

import React, {Fragment, useEffect, useState} from "react";
import MenuItemFoodItemDto from "../../../lib/models/menuitemfooditem/MenuItemFoodItemDto";
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import {toast} from "react-toastify";
import MenuItemFoodItemQueryDto from "../../../lib/models/menuitemfooditem/MenuItemFoodItemQueryDto";
import {Button, Spinner, useDisclosure} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import IngredientDto from "../../../lib/models/ingredient/IngredientDto";

export default function MenuItemFoodItemComponent() {
    const menuItemFoodItemAPI: string = "/DataManagement/menu-item-food-item";
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<MenuItemFoodItemQueryDto>(
        {
            consumption: 0,
            foodItem_Id: 0,
            menuItem_Id: 0
        }
    );
    const [editModal, setEditModal] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();
    const [menuItemFoodItem, setMenuItemFoodItem] = useState<BasicDto<MenuItemFoodItemDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                consumption: 0,
                foodItem   : {
                    id      : 0,
                    name    : "",
                    quantity: 0,
                    unit    : {
                        id  : 0,
                        name: ""
                    },
                    type    : {
                        id  : 0,
                        name: ""
                    }
                },
                foodItem_Id: 0,
                menuItem   : {
                    id  : 0,
                    name: ""
                },
                menuItem_Id: 0
            }]
        }
    });
    const [menuItem, setMenuItem] = useState<BasicDto<MenuItemDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                id  : 0,
                name: ""
            }]
        }
    });
    const [foodItem, setFoodItem] = useState<BasicDto<IngredientDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                id      : 0,
                name    : "",
                quantity: 0,
                unit    : {
                    id  : 0,
                    name: ""
                },
                type    : {
                    id  : 0,
                    name: ""
                }
            }]
        }
    })
    let consumption, menuItemId, foodItemId;

    const createMenuItemFoodItem = async function () {
        try {
            let response = await (await httpServices.callAPI(`${menuItemFoodItemAPI}/creation`, {
                menuItem_Id: null,
                foodItem_Id: null,
                consumption: 0
            }, "POST", token)).json();
            return response as BasicDto<MenuItemFoodItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const retrieveMenuItemFoodItem = async function (menuItemFoodItemQuery: MenuItemFoodItemQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuItemFoodItemAPI}/read`, menuItemFoodItemQuery, "POST", token)).json();
            return response as BasicDto<MenuItemFoodItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const updateMenuItemFoodItem = async function (menuItemFoodItemQuery: MenuItemFoodItemQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuItemFoodItemAPI}/update`, menuItemFoodItemQuery, "POST", token)).json();
            return response as BasicDto<MenuItemFoodItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const deleteMenuItemFoodItem = async function (menuItemFoodItemQueryDto: MenuItemFoodItemQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuItemFoodItemAPI}`, menuItemFoodItemQueryDto, "DELETE", token)).json();
            return response as BasicDto<MenuItemFoodItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const showToast = (message: string) => {
        toast(message);
    }

    const updateConsumption = (consume: number) => {
        consumption = consume;
    }

    const updateMenuItem = (mi: number) => {
        menuItemId = mi;
    }

    const updateFoodItem = (fi: number) => {
        foodItemId = fi;
    }
    
    const handleEdit = (menuItemId: number, foodItemId: number) => {
        setEditModal(true);
        (async () => {
            try {

            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })().finally(() => onOpen());
    }

    const handleDelete = (menuItemId: number, foodItemId: number) => {
        (async () => {
            try {
                const server_res = await deleteMenuItemFoodItem({
                    menuItem_Id: menuItemId,
                    foodItem_Id: foodItemId,
                    consumption: null
                });

                if (!server_res) {
                    showToast("Failed to delete MenuItemFoodItem.");
                    return;
                }

                if (!server_res.isSuccess) {
                    showToast(`Fail - ${server_res.error}`);
                    return;
                }

                const menuItemFoodItem_res = await retrieveMenuItemFoodItem({
                    menuItem_Id: null,
                    foodItem_Id: null,
                    consumption: null
                });

                if (!menuItemFoodItem_res) {
                    showToast("Failed to retrieve updated MenuItemFoodItem.");
                    return;
                }

                if (!menuItemFoodItem_res.isSuccess) {
                    showToast(`Fail - ${menuItemFoodItem_res.error}`);
                    return;
                }

                setMenuItemFoodItem(menuItemFoodItem_res);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })();
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const cancelEdition = () => {
        onClose();
    }

    useEffect(() => {
        (async () => {
            try {
                const menuItemFoodItem_res = await retrieveMenuItemFoodItem({
                    menuItem_Id: null,
                    foodItem_Id: null,
                    consumption: null
                });

                if (!menuItemFoodItem_res) {
                    showToast("Failed to retrieve Menu Item and Food Item");
                    return;
                }

                if (!menuItemFoodItem_res.isSuccess) {
                    showToast(`Fail - ${menuItemFoodItem_res.error}`);
                    return;
                }

                setHeaders(Object.keys((menuItemFoodItem_res.value.resultDto as MenuItemFoodItemDto[])[0]));
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })();
    }, []);

    const confirmEdition = () => {

    }

    const cancelCreation = () => {
        onClose();
    }

    const confirmCreation = () => {

    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                </>
            )
        } else {
            return (
                <>
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
            <div className={"grid grid-cols-4 w-full"}>
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
                    menuItemFoodItem.value.resultDto.map((menuItemFoodItemDto) => {
                        return (
                            <Fragment key={`${menuItemFoodItemDto.menuItem_Id}${menuItemFoodItemDto.foodItem_Id}`}>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemFoodItemDto.menuItem.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemFoodItemDto.foodItem.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemFoodItemDto.consumption}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button
                                        onClick={() => handleDelete(menuItemFoodItemDto.menuItem_Id, menuItemFoodItemDto.foodItem_Id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button
                                        onClick={() => handleEdit(menuItemFoodItemDto.menuItem_Id, menuItemFoodItemDto.foodItem_Id)}>
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