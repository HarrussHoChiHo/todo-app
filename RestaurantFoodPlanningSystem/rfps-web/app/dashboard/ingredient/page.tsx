"use client"

import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import IngredientDto from "../../../lib/models/ingredient/IngredientDto";
import IngredientQueryDto from "../../../lib/models/ingredient/IngredientQueryDto";
import TypeDto from "../../../lib/models/type/TypeDto";
import UnitDto from "../../../lib/models/unit/UnitDto";
import {element} from "prop-types";
import {Button, useDisclosure} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import UserDto from "../../../lib/models/user/UserDto";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";

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
    const [headers, setHeaders] = useState<string[]>([]);
    const [types, setTypes] = useState<TypeDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);

    const foodItemAPI: string = "/food-item";
    const typeAPI: string = "/type";
    const unitAPI: string = "/unit";

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
            let server_res = await retrieveIngredient({id: id, type_Id: null,  quantity: null,  unit_Id: null, name: null});
            
            if (server_res){
                setEditObj(server_res.value.resultDto[0]);
            } else {
                throw new Error("Failed to retrieve object for delete");
            }
        })().finally(() => onOpen());
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
            <div className={"grid grid-cols-6 w-full"}>
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
                    ingredient.value.resultDto.map((ingredDto, index) => (
                        <Fragment key={ingredDto.id}>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.id}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.name}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.type.name}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.quantity}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {ingredDto.unit.name}
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
        </>
    );
}