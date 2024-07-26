"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import IngredientDto from "../../../lib/models/ingredient/IngredientDto";
import IngredientQueryDto from "../../../lib/models/ingredient/IngredientQueryDto";
import TypeDto from "../../../lib/models/type/TypeDto";
import UnitDto from "../../../lib/models/unit/UnitDto";
import {Button, Input, Select, SelectItem, Spinner, useDisclosure} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import {toast} from "react-toastify";
import {isEmpty} from "@nextui-org/shared-utils";

export default function IngredientComponent() {
    const httpServices = new HttpServices();
    const {
        token,
        user
    } = useAuth();
    const [ingredient, setIngredient] = useState<BasicDto<IngredientDto>>({
        error    : "",
        isSuccess: false,
        value    : {
            amount   : 0,
            resultDto: [{
                id      : 0,
                name    : "",
                quantity: 0,
                type    : {
                    id  : 0,
                    name: ""
                },
                unit    : {
                    id  : 0,
                    name: ""
                }
            }]
        }
    });
    const [editObj, setEditObj] = useState<IngredientDto>({
        id      : 0,
        name    : "",
        quantity: 0,
        type    : {
            id  : 0,
            name: ""
        },
        unit    : {
            id  : 0,
            name: ""
        }
    });
    const [newIngredient, setNewIngredient] = useState<IngredientQueryDto>({
        id      : null,
        name    : null,
        quantity: null,
        type_Id : null,
        unit_Id : null
    });
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();
    const [editModal, setEditModal] = useState(true);
    const [headers, setHeaders] = useState<string[]>([]);
    const [types, setTypes] = useState<TypeDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInvalid, setIsInvalid] = useState(false)

    const foodItemAPI: string = "/DataManagement/food-item";
    const typeAPI: string = "/DataManagement/type";
    const unitAPI: string = "/DataManagement/unit";

    const showToast = (message: string) => {
        toast(message);
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

    const updateIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        try {
            let server_res = await (await httpServices.callAPI(`${foodItemAPI}/update`, ingredientQueryDto, "POST", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const deleteIngredient = async (id: number) => {
        try {
            let server_res = await (await httpServices.callAPI(`${foodItemAPI}/${id}`, null, "DELETE", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const createIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        try {
            let server_res = await (await httpServices.callAPI(`${foodItemAPI}/creation`, ingredientQueryDto, "POST", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const retrieveType = async () => {
        try {
            let server_res = await (await httpServices.callAPI(`${typeAPI}/read`, {
                id  : null,
                name: null
            }, "POST", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const retrieveUnit = async () => {
        try {
            let server_res = await (await httpServices.callAPI(`${unitAPI}/read`, {
                id  : null,
                name: null
            }, "POST", token)).json();
            return server_res as BasicDto<IngredientDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await deleteIngredient(id);

            if (!server_res) {
                throw new Error("Failed to delete ingredient.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            let retrieveUpdatedIngredient = await retrieveIngredient({
                id      : null,
                name    : null,
                type_Id : null,
                unit_Id : null,
                quantity: null
            });

            if (!retrieveUpdatedIngredient) {
                throw new Error("Failed to retrieve ingredient after delete.");
            }

            if (!retrieveUpdatedIngredient.isSuccess) {
                throw new Error(`Fail - ${retrieveUpdatedIngredient.error}`);
            }

            setIngredient(retrieveUpdatedIngredient!);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed.");
            }
        });
    }

    const handleEdit = (id: number) => {
        (async () => {
            setEditModal(true);
            let server_res = await retrieveIngredient({
                id      : id,
                type_Id : null,
                quantity: null,
                unit_Id : null,
                name    : null
            });

            if (!server_res) {
                throw new Error("Failed to retrieve ingredient for delete");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }
            const [ingredientDto] = server_res.value.resultDto;
            setEditObj(ingredientDto);
            onOpen();
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
    }

    const confirmEdition = () => {
        (async () => {

            if (!editObj.quantity || editObj.quantity < 0) {
                setIsInvalid(true);
                return;
            }

            let server_res = await updateIngredient({
                id      : editObj.id,
                name    : editObj.name,
                quantity: editObj.quantity,
                type_Id : editObj.type.id,
                unit_Id : editObj.unit.id
            });

            if (!server_res) {
                throw new Error("Failed to update ingredient.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }
            let retrieveIngredientRes = await retrieveIngredient({
                id      : null,
                name    : null,
                quantity: null,
                unit_Id : null,
                type_Id : null
            });

            if (!retrieveIngredientRes) {
                throw new Error("Failed to retrieve updated ingredient");
            }

            if (!retrieveIngredientRes.isSuccess) {
                throw new Error(`Fail - ${retrieveIngredientRes.error}`);
            }
            setIngredient(retrieveIngredientRes!);
            onClose();
            setIsInvalid(false);
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
    }

    const confirmCreation = () => {
        (async () => {
            if (!newIngredient.quantity || newIngredient.quantity < 0) {
                setIsInvalid(true);
                return;
            }
            const {
                name,
                type_Id,
                unit_Id,
                quantity
            } = newIngredient;
            let server_res = await createIngredient({
                id      : null,
                name    : name,
                type_Id : type_Id,
                unit_Id : unit_Id,
                quantity: quantity
            });

            if (!server_res) {
                throw new Error("Failed to create ingredient.");
            }

            if (!server_res!.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            let retrieveIngredientRes = await retrieveIngredient({
                id      : null,
                name    : null,
                quantity: null,
                unit_Id : null,
                type_Id : null
            });

            if (!retrieveIngredientRes) {
                throw new Error("Failed to retrieve created ingredient.");
            }

            if (!retrieveIngredientRes.isSuccess) {
                throw new Error(`Fail - ${retrieveIngredientRes.error}`);
            }
            setIngredient(retrieveIngredientRes!);
            onClose();
            setIsInvalid(false);
        })().catch(error => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Service crashed.");
            }
        });
    }

    const cancelEdition = () => {
        setIsInvalid(false);
        onClose();
    }

    const cancelCreation = () => {
        setIsInvalid(false);
        onClose();
    }

    const updateName = (name: string) => {
        const {
            id,
            quantity,
            unit,
            type
        } = editObj;

        setEditObj({
            id      : id,
            name    : name,
            unit    : unit,
            type    : type,
            quantity: quantity
        });
    }

    const updateQuantity = (quantityStr: string) => {

        let quantity = parseInt(quantityStr);

        if ((isNaN(quantity) || !Number.isInteger(quantity) || quantity.toString() !== quantityStr) && !isEmpty(quantityStr)) {
            setIsInvalid(true);
            return;
        }

        if (quantity < 0) {
            setIsInvalid(true);
            return;
        }
        const {
            id,
            name,
            unit,
            type
        } = editObj;

        setEditObj({
            id      : id,
            name    : name,
            unit    : unit,
            type    : type,
            quantity: quantity
        });
        setIsInvalid(false);
    }

    const updateUnit = (unit: string[]) => {
        const {
            id,
            name,
            quantity,
            type
        } = editObj;
        const newUnitId: number = parseInt(unit[0]);
        const [newUnit] = units.filter(iunit => iunit.id === newUnitId);
        setEditObj({
            id      : id,
            name    : name,
            unit    : newUnit,
            type    : type,
            quantity: quantity
        });
    }

    const updateType = (type: string[]) => {
        const {
            id,
            name,
            quantity,
            unit
        } = editObj;
        const newTypeId: number = parseInt(type[0]);
        const [newType] = types.filter(itype => itype.id === newTypeId);
        setEditObj({
            id      : id,
            name    : name,
            quantity: quantity,
            unit    : unit,
            type    : newType
        });
    }

    const createNewName = (name: string) => {
        const {
            id,
            type_Id,
            unit_Id,
            quantity
        } = newIngredient;
        setNewIngredient({
            id      : id,
            type_Id : type_Id,
            unit_Id : unit_Id,
            quantity: quantity,
            name    : name
        });
    }

    const createNewQuantity = (quantity: number) => {
        const {
            id,
            type_Id,
            unit_Id,
            name
        } = newIngredient;
        setNewIngredient({
            id      : id,
            type_Id : type_Id,
            unit_Id : unit_Id,
            quantity: quantity,
            name    : name
        });
    }

    const createNewUnit = (unit: string[]) => {
        const {
            id,
            quantity,
            type_Id,
            name
        } = newIngredient;
        setNewIngredient({
            id      : id,
            type_Id : type_Id,
            unit_Id : parseInt(unit[0]),
            quantity: quantity,
            name    : name
        });
    }

    const createNewType = (type: string[]) => {
        const {
            id,
            quantity,
            unit_Id,
            name
        } = newIngredient;
        setNewIngredient({
            id      : id,
            type_Id : parseInt(type[0]),
            unit_Id : unit_Id,
            quantity: quantity,
            name    : name
        });
    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <Input label={"Name"}
                           type={"text"}
                           defaultValue={editObj.name}
                           isRequired={true}
                           value={editObj.name.toString()}
                           onChange={(event) => updateName(event.target.value)}
                    />
                    <Input label={"Quantity"}
                           type={"number"}
                           min={0}
                           isInvalid={isInvalid}
                           defaultValue={editObj.quantity.toString()}
                           value={editObj.quantity.toString()}
                           isRequired={true}
                           onChange={(event) => updateQuantity(event.target.value)}
                    />
                    <Select
                        label={"Units"}
                        selectionMode={"single"}
                        selectedKeys={editObj.unit.id.toString()}
                        isRequired={true}
                        onSelectionChange={(selection) => updateUnit(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            units.map(value =>
                                <SelectItem key={value.id} value={value.id}>
                                    {value.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                    <Select
                        label={"Type"}
                        selectionMode={"single"}
                        selectedKeys={editObj.type.id.toString()}
                        isRequired={true}
                        onSelectionChange={(selection) => updateType(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            types.map(value =>
                                <SelectItem key={value.id} value={value.id}>
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
                    <Input label={"Name"}
                           type={"text"}
                           isRequired={true}
                           onChange={(event) => createNewName(event.target.value)}
                    />
                    <Input label={"Quantity"}
                           type={"number"}
                           min={0}
                           isInvalid={isInvalid}
                           isRequired={true}
                           onChange={(event) => createNewQuantity(parseInt(event.target.value))}
                    />
                    <Select
                        label={"Units"}
                        selectionMode={"single"}
                        isRequired={true}
                        onSelectionChange={(selection) => createNewUnit(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            units.map(value =>
                                <SelectItem key={value.id} value={value.name}>
                                    {value.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                    <Select
                        label={"Type"}
                        selectionMode={"single"}
                        isRequired={true}
                        onSelectionChange={(selection) => createNewType(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            types.map(value =>
                                <SelectItem key={value.id} value={value.name}>
                                    {value.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                </>
            )
        }
    }

    useEffect(() => {
        (async () => {
            try {
                let server_res = await retrieveIngredient({
                    id      : null,
                    name    : null,
                    type_Id : null,
                    unit_Id : null,
                    quantity: null
                });

                if (!server_res) {
                    showToast("Failed to retrieve ingredient");
                    return;
                }

                if (!server_res.isSuccess) {
                    showToast(`Fail - ${server_res.error}`);
                    return;
                }

                setIngredient(server_res!);
                setHeaders(Object.keys(server_res!.value.resultDto[0]))
                let typeRetrieve = await retrieveType();

                if (!typeRetrieve) {
                    showToast("Failed to retrieve type");
                    return;
                }

                if (!typeRetrieve.isSuccess) {
                    showToast(`Fail - ${typeRetrieve.error}`);
                    return;
                }

                setTypes(typeRetrieve!.value.resultDto);

                let unitRetrieve = await retrieveUnit();

                if (!unitRetrieve) {
                    showToast("Failed to retrieve unit");
                    return;
                }

                if (!unitRetrieve.isSuccess) {
                    showToast(`Fail - ${unitRetrieve.error}`);
                    return;
                }

                setUnits(unitRetrieve!.value.resultDto);
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

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <>
            {
                user?.role.includes("Manager")
                    ? (<div className={"w-full flex flex-row justify-end p-2"}>
                        <Button variant={"ghost"}
                                startContent={<FontAwesomeIcon icon={faFolderPlus}/>}
                                className={"w-3/12"}
                                onClick={handleCreate}
                        />
                    </div>)
                    : (<></>)
            }

            <div className={"grid grid-cols-7 w-full"}>
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
                    ingredient.value.resultDto.map((ingredDto, index) => (
                        <Fragment key={ingredDto.id}>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.id}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.name}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.quantity}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.unit.name}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.type.name}
                            </div>
                            {
                                user?.role.includes("Manager")
                                    ? (
                                        <>
                                            <div className={"p-4 gird-style text-center"}>
                                                <button onClick={() => handleDelete(ingredDto.id)}>
                                                    <FontAwesomeIcon icon={faTrash}
                                                                     id={ingredDto.id.toString()}/>
                                                </button>
                                            </div>
                                            <div className={"p-4 gird-style text-center"}>
                                                <button onClick={() => handleEdit(ingredDto.id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                                </button>
                                            </div>
                                        </>
                                    )
                                    : (
                                        <></>
                                    )
                            }
                        </Fragment>
                    ))
                }
            </div>
            <Modals isOpen={isOpen}
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