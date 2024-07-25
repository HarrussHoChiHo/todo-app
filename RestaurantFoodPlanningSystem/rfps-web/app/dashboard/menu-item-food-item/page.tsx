"use client"

import React, {Fragment, useEffect, useState} from "react";
import MenuItemFoodItemDto, {mifiHeaders} from "../../../lib/models/menuitemfooditem/MenuItemFoodItemDto";
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import {toast} from "react-toastify";
import MenuItemFoodItemQueryDto from "../../../lib/models/menuitemfooditem/MenuItemFoodItemQueryDto";
import {Button, Input, Select, SelectItem, Spinner, useDisclosure} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import MenuItemDto from "../../../lib/models/menu/MenuItemDto";
import IngredientDto from "../../../lib/models/ingredient/IngredientDto";
import IngredientQueryDto from "../../../lib/models/ingredient/IngredientQueryDto";
import {throws} from "node:assert";
import update = toast.update;

export default function MenuItemFoodItemComponent() {
    const menuItemFoodItemAPI: string = "/DataManagement/menu-item-food-item";
    const menuItemAPI: string = "/DataManagement/menu-item";
    const foodItemAPI: string = "/DataManagement/food-item";
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [editObj, setEditObj] = useState<MenuItemFoodItemDto>(
        {
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
            menuItem   : {
                id  : 0,
                name: ""
            },
            consumption: 0,
            foodItem_Id: 0,
            menuItem_Id: 0
        }
    );
    const [editModal, setEditModal] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [invalidConsumption, setInvalidConsumption] = useState(false)
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

    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        try {
            let response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const retrieveIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        try {
            let server_res = await (await httpServices.callAPI(`${foodItemAPI}/read`, ingredientQueryDto, "POST", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
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

    const updateConsumption = (consumption: number) => {
        if (consumption < 1){
            setInvalidConsumption(true);
            return;
        }
        
        const {
            foodItem_Id,
            menuItem_Id,
            menuItem,
            foodItem
        } = editObj;
        setEditObj({
            menuItem_Id: menuItem_Id,
            foodItem_Id: foodItem_Id,
            consumption: consumption,
            menuItem,
            foodItem
        });
        setInvalidConsumption(false);
    }

    const updateMenuItem = (mi: number) => {
        const {
            foodItem_Id,
            consumption,
            menuItem,
            foodItem
        } = editObj;
        setEditObj({
            menuItem_Id: mi,
            foodItem_Id: foodItem_Id,
            consumption: consumption,
            menuItem,
            foodItem
        });
    }

    const updateFoodItem = (fi: number) => {
        const {
            menuItem_Id,
            consumption,
            menuItem,
            foodItem
        } = editObj;
        setEditObj({
            menuItem_Id: menuItem_Id,
            foodItem_Id: fi,
            consumption: consumption,
            menuItem,
            foodItem
        });
    }

    const handleEdit = (menuItemId: number, foodItemId: number) => {
        setEditModal(true);
        (async () => {
            try {
                const menuItem_res = await retrieveMenuItem({
                    id  : null,
                    name: null
                });

                if (!menuItem_res) {
                    showToast("Failed to retrieve menu item.");
                    return;
                }

                if (!menuItem_res.isSuccess) {
                    showToast(`Fail - ${menuItem_res.error}`);
                }

                setMenuItem(menuItem_res);

                const foodItem_res = await retrieveIngredient({
                    id      : null,
                    unit_Id : null,
                    type_Id : null,
                    name    : null,
                    quantity: null
                });

                if (!foodItem_res) {
                    showToast("Failed to retrieve food item.");
                    return;
                }

                if (!foodItem_res.isSuccess) {
                    showToast(`Fail - ${foodItem_res.error}`);
                }

                setFoodItem(foodItem_res);

                const [tempEditObj] = menuItemFoodItem.value.resultDto.filter(mifi => mifi.foodItem_Id === foodItemId && mifi.menuItem_Id === menuItemId);

                if (!tempEditObj) {
                    showToast("Failed to find related item.");
                    return;
                }
                setEditObj(tempEditObj);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed")
                }
            }
        })().then(() => onOpen()).catch(error => showToast("Failed to find related item."));
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
            const menuItemFoodItem_res = await retrieveMenuItemFoodItem({
                menuItem_Id: null,
                foodItem_Id: null,
                consumption: null
            });

            if (!menuItemFoodItem_res) {
                throw new Error("Failed to retrieve Menu Item and Food Item.");
            }

            if (!menuItemFoodItem_res.isSuccess) {
                throw new Error(`Fail - ${menuItemFoodItem_res.error}`);
            }

            setMenuItemFoodItem(menuItemFoodItem_res);
            setIsLoading(false);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }, []);

    const confirmEdition = () => {
        (async () => {
            const {
                foodItem_Id,
                menuItem_Id,
                consumption
            } = editObj;

            const update_res = await updateMenuItemFoodItem({
                menuItem_Id: menuItem_Id,
                foodItem_Id: foodItem_Id,
                consumption: consumption
            });

            if (!update_res) {
                throw new Error("Failed to update.");
            }

            if (!update_res.isSuccess) {
                throw new Error(`Fail - ${update_res.error}`);
            }

            const retrieve_res = await retrieveMenuItemFoodItem({
                menuItem_Id: null,
                foodItem_Id: null,
                consumption: null
            });
            
            if (!retrieve_res){
                throw new Error("Failed to retrieve updated items.");
            }
            
            if (!retrieve_res.isSuccess){
                throw new Error(`Fail - ${retrieve_res.error}`);
            }
            
            setMenuItemFoodItem(retrieve_res);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }).finally(() => onClose());
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
                    <Select
                        label={"Food Item"}
                        selectionMode={"single"}
                        selectedKeys={editObj.foodItem_Id?.toString()}
                        onSelectionChange={(selection) => updateFoodItem(Array.from(selection)[0] as number)}
                    >
                        {
                            foodItem.value.resultDto.map(value =>
                                <SelectItem key={value.id}
                                            value={value.id}
                                            textValue={value.name}
                                >
                                    {value.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                    <Input label={"Consumption"}
                           type={"number"}
                           min={1}
                           isRequired={true}
                           isInvalid={invalidConsumption}
                           defaultValue={editObj.consumption?.toString()}
                           onChange={(event) => updateConsumption(parseInt(event.target.value))}
                    />
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
            <div className={"grid grid-cols-5 w-full"}>
                {
                    mifiHeaders.map((header) => (
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