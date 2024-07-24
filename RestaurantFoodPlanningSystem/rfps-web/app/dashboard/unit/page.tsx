"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import UnitDto from "../../../lib/models/unit/UnitDto";
import UnitQueryDto from "../../../lib/models/unit/UnitQueryDto";
import {Button, Input, Spinner, useDisclosure} from "@nextui-org/react";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import Modals from "../../../components/CustomModal";
import {toast} from "react-toastify";

export default function UnitComponent() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [headers, setHeaders] = useState<string[]>([]);
    const unitAPI: string = "/DataManagement/unit";
    const [unit, setUnit] = useState<BasicDto<UnitDto>>(
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
    const [editObj, setEditObj] = useState<UnitDto>({
        id: 0,
        name: ""
    });
    const [editModal, setEditModal] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();
    let newName: string;

    useEffect(() => {
        (async () => {
            try {
                let retrieveRes = await retrieveUnit({
                    id: null,
                    name: null
                });

                if (!retrieveRes) {
                    showToast("Failed to retrieve unit");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                
                setUnit(retrieveRes);
                setHeaders(Object.keys(new UnitDto(0, "")));
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
    
    const showToast = (message: string) => {
        toast(message);
    }
    
    const retrieveUnit = async (unitQueryDto: UnitQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${unitAPI}/read`, unitQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const createUnit = async (unitQueryDto: UnitQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${unitAPI}/creation`, unitQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const updateUnit = async (unitQueryDto: UnitQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${unitAPI}/update`, unitQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const deleteUnit = async (id: number) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${unitAPI}/${id}`, null, "DELETE", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const handleDelete = (id: number) => {
        (async () => {
            try {
                let deleteRes = await deleteUnit(id);
                
                if (!deleteRes){
                    showToast("Failed to delete unit");
                    return;
                }
                
                if (!deleteRes.isSuccess) {
                    showToast(`Fail - ${deleteRes.error}`);
                    return;
                }
                
                let retrieveRes = await retrieveUnit({
                    id: null,
                    name: null
                });

                if (!retrieveRes){
                    showToast("Failed to retrieve updated unit list");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setUnit(retrieveRes);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })();
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            try {
                let retrieveRes = await retrieveUnit({
                    id: id,
                    name: null
                });
                
                if (!retrieveRes){
                    showToast("Failed to retrieve updated unit");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                
                setEditObj(retrieveRes.value.resultDto[0]);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })().finally(() => onOpen());
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }
    
    const updateName = (name: string) => {
        const {id} = editObj;
        setEditObj({
            id: id,
            name: name
        });
    }
    
    const createNewName = (name: string) => {
        newName = name;
    }

    const confirmEdition = () => {
        (async () => {
            try {
                let updateRes = await updateUnit({
                    id: editObj.id,
                    name: editObj.name
                });
                
                if (!updateRes){
                    showToast("Failed to update unit");
                    return;
                }
                
                if (!updateRes.isSuccess) {
                    showToast(`Fail - ${updateRes.error}`);
                    return;
                }

                let retrieveRes = await retrieveUnit({
                    id: null,
                    name: null
                });

                if (!retrieveRes){
                    showToast("Failed to retrieve updated unit");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setUnit(retrieveRes);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })().finally((() => closeModal()));
    }

    const confirmCreation = () => {
        (async () => {
            try {
                let creationRes = await createUnit({
                    id: null,
                    name: newName
                });
                
                if (!creationRes){
                    showToast("Failed to create unit");
                    return;
                }
                
                if (!creationRes.isSuccess) {
                    showToast(`Fail - ${creationRes.error}`);
                    return;
                }

                let retrieveRes = await retrieveUnit({
                    id: null,
                    name: null
                });

                if (!retrieveRes){
                    showToast("Failed to retrieve newly created unit");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setUnit(retrieveRes);
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message);
                } else {
                    showToast("Service crashed");
                }
            }
        })().finally((() => closeModal()));
    }

    const closeModal = () => {
        onClose();
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
                </>
            )
        }
    }

    if (isLoading){
        return <Spinner />;
    }
    
    return (
        <>
            <div className={"w-full flex flex-row justify-end p-2"}>
                <Button variant={"ghost"}
                        startContent={<FontAwesomeIcon icon={faFolderPlus}/>}
                        className={"w-3/12"}
                        onClick={handleCreate}
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
                    unit.value.resultDto.map((unitDto, index) => {
                        return (
                            <Fragment key={unitDto.id}>
                                <div className={"p-4 gird-style text-center"}>
                                    {unitDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {unitDto.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(unitDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(unitDto.id)}>
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
                    onCancel={closeModal}
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