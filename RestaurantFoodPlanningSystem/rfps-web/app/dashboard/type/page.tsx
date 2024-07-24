"use client"
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import React, {Fragment, useEffect, useState} from "react";
import UnitDto from "../../../lib/models/unit/UnitDto";
import {Button, Input, Spinner, useDisclosure} from "@nextui-org/react";
import TypeDto from "../../../lib/models/type/TypeDto";
import TypeQueryDto from "../../../lib/models/type/TypeQueryDto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modals from "../../../components/CustomModal";
import {toast} from "react-toastify";

export default function TypeComponent() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [headers, setHeaders] = useState<string[]>([]);
    const typeAPI: string = "/DataManagement/type";
    const [type, setType] = useState<BasicDto<TypeDto>>({
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
    const [editObj, setEditObj] = useState<TypeDto>({
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

    const showToast = (message: string) => {
        toast(message);
    }
    
    const retrieveType = async (typeQueryDto: TypeQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${typeAPI}/read`, typeQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const createType = async (typeQueryDto: TypeQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${typeAPI}/creation`, typeQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const updateType = async (typeQueryDto: TypeQueryDto) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${typeAPI}/update`, typeQueryDto, "POST", token)).json();
            return serverRes as BasicDto<UnitDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        }
    }

    const deleteType = async (id: number) => {
        try {
            let serverRes = await (await httpServices.callAPI(`${typeAPI}/${id}`, null, "DELETE", token)).json();
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
                let deleteRes = await deleteType(id);

                if (!deleteRes) {
                    showToast("Failed to delete type.");
                    return;
                }

                if (!deleteRes.isSuccess) {
                    showToast("Failed to delete type");
                    return;
                }
                let retrieveRes = await retrieveType({
                    id  : null,
                    name: null
                });

                if (!retrieveRes) {
                    showToast("Failed to retrieve type after deletion.");
                    return;
                }

                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }

                setType(retrieveRes);
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
                let retrieveRes = await retrieveType({
                    id  : id,
                    name: null
                });

                if (!retrieveRes) {
                    showToast("Failed to retrieve updated type");
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
                let updateRes = await updateType({
                    id  : editObj.id,
                    name: editObj.name
                });

                if (!updateRes) {
                    showToast("Failed to update type");
                    return;
                }

                if (!updateRes.isSuccess) {
                    showToast(`Fail - ${updateRes.error}`);
                    return;
                }

                let retrieveRes = await retrieveType({
                    id  : null,
                    name: null
                });

                if (!retrieveRes) {
                    showToast("Failed to retrieve updated type");
                    return;
                }

                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }

                setType(retrieveRes);
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
                let creationRes = await createType({
                    id  : null,
                    name: newName
                });

                if (!creationRes) {
                    showToast("Failed to create type");
                    return;
                }

                if (!creationRes.isSuccess) {
                    showToast(`Fail - ${creationRes.error}`);
                    return;
                }

                let retrieveRes = await retrieveType({
                    id  : null,
                    name: null
                });

                if (!retrieveRes) {
                    showToast("Failed to retrieve type");
                    return;
                }

                if (!retrieveRes.isSuccess) {
                    showToast("Failed to retrieve newly created type");
                    return;
                }
                setType(retrieveRes);
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
    
    useEffect(() => {
        (async () => {
            try {
                let retrieveRes = await retrieveType({
                    id  : null,
                    name: null
                });
                
                if (!retrieveRes){
                    showToast("Failed to retrieve type");
                    return;
                }
                
                if (!retrieveRes.isSuccess) {
                    showToast(`Fail - ${retrieveRes.error}`);
                    return;
                }
                setType(retrieveRes);
                setHeaders(Object.keys(new TypeDto(0, "")));
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

    if (isLoading) {
        return <Spinner/>;
    }
    
    return(
        <>
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
                        type.value.resultDto.map((typeDto, index) => {
                            return (
                                <Fragment key={typeDto.id}>
                                    <div className={"p-4 gird-style text-center"}>
                                        {typeDto.id}
                                    </div>
                                    <div className={"p-4 gird-style text-center"}>
                                        {typeDto.name}
                                    </div>
                                    <div className={"p-4 gird-style text-center"}>
                                        <button onClick={() => handleDelete(typeDto.id)}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </div>
                                    <div className={"p-4 gird-style text-center"}>
                                        <button onClick={() => handleEdit(typeDto.id)}>
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
        </>
    )
}