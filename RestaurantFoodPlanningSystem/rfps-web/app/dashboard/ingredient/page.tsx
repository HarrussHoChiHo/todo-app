"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import IngredientDto from "../../../lib/models/ingredient/IngredientDto";
import IngredientQueryDto from "../../../lib/models/ingredient/IngredientQueryDto";
import TypeDto from "../../../lib/models/type/TypeDto";
import UnitDto from "../../../lib/models/unit/UnitDto";
import {Button, Input, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";

export default function IngredientComponent() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [ingredient, setIngredient] = useState<BasicDto<IngredientDto>>({
        error: "",
        isSuccess: false,
        value: {
            amount: 0,
            resultDto: [{
                id: 0,
                name: "",
                quantity: 0,
                type: {
                    id: 0,
                    name: ""
                },
                unit: {
                    id: 0,
                    name: ""
                }
            }]
        }
    });
    const [editObj, setEditObj] = useState<IngredientDto>({
        id: 0,
        name: "",
        quantity: 0,
        type: {
            id: 0,
            name: ""
        },
        unit: {
            id: 0,
            name: ""
        }
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

    let newName: string, newQuantity: number, newUnit: number, newType: number;

    const foodItemAPI: string = "/DataManagement/food-item";
    const typeAPI: string = "/DataManagement/type";
    const unitAPI: string = "/DataManagement/unit";

    const retrieveIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        let server_res = await (await httpServices.callAPI(`${foodItemAPI}/read`, ingredientQueryDto, "POST", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const updateIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        let server_res = await (await httpServices.callAPI(`${foodItemAPI}/update`, ingredientQueryDto, "POST", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const deleteIngredient = async (id: number) => {
        let server_res = await (await httpServices.callAPI(`${foodItemAPI}/${id}`, null, "DELETE", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const createIngredient = async (ingredientQueryDto: IngredientQueryDto) => {
        let server_res = await (await httpServices.callAPI(`${foodItemAPI}/creation`, ingredientQueryDto, "POST", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const retrieveType = async () => {
        let server_res = await (await httpServices.callAPI(`${typeAPI}/read`, {
            id: null,
            name: null
        }, "POST", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const retrieveUnit = async () => {
        let server_res = await (await httpServices.callAPI(`${unitAPI}/read`, {
            id: null,
            name: null
        }, "POST", token)).json();
        return server_res as BasicDto<IngredientDto>;
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await deleteIngredient(id);
            if (server_res.isSuccess) {
                let retrieveUpdatedIngredient = await retrieveIngredient({
                    id: null,
                    name: null,
                    type_Id: null,
                    unit_Id: null,
                    quantity: null
                });

                if (retrieveUpdatedIngredient.isSuccess) {
                    setIngredient(retrieveUpdatedIngredient);
                } else {
                    throw new Error("Failed to retrieve ingredient after delete");
                }
            } else {
                throw new Error("Failed to delete ingredient");
            }
        })();
    }

    const handleEdit = (id: number) => {
        (async () => {
            setEditModal(true);
            let server_res = await retrieveIngredient({
                id: id,
                type_Id: null,
                quantity: null,
                unit_Id: null,
                name: null
            });

            if (server_res) {
                setEditObj(server_res.value.resultDto[0]);
            } else {
                throw new Error("Failed to retrieve object for delete");
            }
        })().finally(() => onOpen());
    }

    const confirmEdition = () => {
        (async () => {
            let server_res = await updateIngredient({
                id: editObj.id,
                name: editObj.name,
                quantity: editObj.quantity,
                type_Id: editObj.type.id,
                unit_Id: editObj.unit.id
            });
            if (server_res.isSuccess) {
                let retrieveIngredientRes = await retrieveIngredient({
                    id: null,
                    name: null,
                    quantity: null,
                    unit_Id: null,
                    type_Id: null
                });
                if (retrieveIngredientRes.isSuccess){
                    setIngredient(retrieveIngredientRes);
                } else {
                    throw new Error(JSON.stringify(retrieveIngredientRes));
                }
            } else {
                throw new Error(JSON.stringify(server_res));
            }
        })().finally(() => onClose());
    }

    const confirmCreation = () => {
        (async () => {
            let server_res = await createIngredient({
                id: null,
                name: newName,
                type_Id: newType,
                unit_Id: newUnit,
                quantity: newQuantity
            });
            if (server_res.isSuccess) {
                let retrieveIngredientRes = await retrieveIngredient({
                    id: null,
                    name: null,
                    quantity: null,
                    unit_Id: null,
                    type_Id: null
                });
                if (retrieveIngredientRes.isSuccess){
                    setIngredient(retrieveIngredientRes);
                } else {
                    throw new Error(JSON.stringify(retrieveIngredientRes));
                }
            } else {
                throw new Error(JSON.stringify(server_res));
            }
        })().finally(() => onClose());
    }

    const cancelEdition = () => {
        onClose();
    }

    const cancelCreation = () => {
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
            id: id,
            name: name,
            unit: unit,
            type: type,
            quantity: quantity
        });
    }

    const updateQuantity = (quantity: number) => {
        const {
            id,
            name,
            unit,
            type
        } = editObj;

        setEditObj({
            id: id,
            name: name,
            unit: unit,
            type: type,
            quantity: quantity
        });
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
            id: id,
            name: name,
            unit: newUnit,
            type: type,
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
            id: id,
            name: name,
            quantity: quantity,
            unit: unit,
            type: newType
        });
    }

    const createNewName = (name: string) => {
        newName = name;
    }

    const createNewQuantity = (quantity: number) => {
        newQuantity = quantity;
    }

    const createNewUnit = (unit: string[]) => {
        newUnit = parseInt(unit[0]);
    }

    const createNewType = (type: string[]) => {
        newType = parseInt(type[0]);
    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <Input label={"Name"}
                           type={"text"}
                           defaultValue={editObj.name}
                           isRequired={true}
                           onChange={(event) => updateName(event.target.value)}
                    />
                    <Input label={"Quantity"}
                           type={"number"}
                           min={0}
                           defaultValue={editObj.quantity.toString()}
                           isRequired={true}
                           onChange={(event) => updateQuantity(parseInt(event.target.value))}
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
            let server_res = await retrieveIngredient({
                id: null,
                name: null,
                type_Id: null,
                unit_Id: null,
                quantity: null
            });

            if (server_res.isSuccess) {
                setIngredient(server_res);
                setHeaders(Object.keys(server_res.value.resultDto[0]))
                let typeRetrieve = await retrieveType();

                if (typeRetrieve.isSuccess) {
                    setTypes(typeRetrieve.value.resultDto);
                } else {
                    throw new Error("Failed to retrieve type");
                }

                let unitRetrieve = await retrieveUnit();

                if (unitRetrieve.isSuccess) {
                    setUnits(unitRetrieve.value.resultDto);
                } else {
                    throw new Error("Failed to retrieve unit");
                }

            } else {
                throw new Error("Failed to retrieve ingredient");
            }

        })();
    }, []);

    return (
        <>
            <div className={"w-full flex flex-row justify-end p-2"}>
                <Button variant={"ghost"}
                        startContent={<FontAwesomeIcon icon={faFolderPlus}/>}
                        className={"w-3/12"}
                        onClick={handleCreate}
                />
            </div>
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
                        </Fragment>
                    ))
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