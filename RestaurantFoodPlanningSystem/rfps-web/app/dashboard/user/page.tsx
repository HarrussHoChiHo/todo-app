"use client"
import React, {Fragment, useEffect, useState} from "react";
import HttpServices from "../../../lib/HttpServices";
import UserDto from "../../../lib/models/user/UserDto";
import {useAuth} from "../../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import RoleDto from "../../../lib/models/RoleDto";
import {Button, Input, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import UserQueryDto from "../../../lib/models/user/UserQueryDto";

export default function Page() {
    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [jsonObj, setJsonObj] = useState<BasicDto<UserDto>>({
        error: "",
        isSuccess: false,
        value: {
            amount: 0,
            resultDto: [{
                id: 0,
                password: "",
                userName: "",
                role: []
            }]
        }
    });
    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<UserDto>({
        id: 0,
        password: "",
        role: [],
        userName: ""
    });
    const [editModal, setEditModal] = useState(true);
    let newName: string, newPassword: string, newRoles: string[];
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();

    const userAPI = "/User";
    const roleAPI = "/Role";

    useEffect(() => {
        (async function fetchData() {
            let server_res = await retrieveAllUser();
            setJsonObj(server_res);
            if (server_res.value.resultDto) {
                setHeaders(Object.keys(server_res.value.resultDto[0]));
            }
           let role_res = await retrieveAllRoles();
            setRoles(role_res.value.resultDto);
        })();
    }, []);

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await (await httpServices.callAPI(`/User/${id}`, null, "DELETE", token)).json() as BasicDto<UserDto>;
            if (server_res.isSuccess) {
                let updatedList = await (await httpServices.callAPI("/user", null, "GET", token)).json() as BasicDto<UserDto>;
                if (updatedList.isSuccess) {
                    setJsonObj(updatedList);
                } else {
                    throw new Error("Failed to retrieve updated list");
                }
            } else {
                throw new Error("Failed to delete user");
            }
        })();
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        let targetedObj;
        if (jsonObj.value.resultDto) {
            [targetedObj] = jsonObj.value.resultDto.filter((dto: { id: number; }) => dto.id === id);
            setEditObj(targetedObj);
        }
       onOpen();
    }

    const createUser = async (userQueryDto: UserQueryDto) => {
        let server_response = await (await httpServices.callAPI(`${userAPI}/register`, userQueryDto, "POST", token)).json();
        return server_response as BasicDto<UserDto>;
    }

    const retrieveAllUser = async () => {
        let server_response = await (await httpServices.callAPI(`${userAPI}/`, null, "GET", token)).json();
        return server_response as BasicDto<UserDto>;
    }

    const retrieveAllRoles = async () => {
        let server_response = await (await httpServices.callAPI(`${roleAPI}/read`, {
            name: null,
            description: null,
            id: null,
            createdDate: null
        }, "POST", token)).json();
        return server_response as BasicDto<RoleDto>;
    }
    
    const updateUser = async () => {
        let server_response = await (await httpServices.callAPI("/user/update", editObj, "POST", token)).json();
        return server_response as BasicDto<UserDto>;
    }

    const updateUserName = (updatedUserName: string) => {
        let {
            id,
            role,
            password
        } = editObj;
        setEditObj({
            id: id,
            userName: updatedUserName,
            role: role,
            password: password
        });
    }

    const updatePassword = (updatedPassword: string) => {
        let {
            id,
            role,
            userName
        } = editObj;

        setEditObj({
            id: id,
            userName: userName,
            role: role,
            password: updatedPassword
        });
    }

    const updateRole = (updatedRole: string[]) => {
        let {
            id,
            userName,
            password
        } = editObj;
        setEditObj({
            id: id,
            userName: userName,
            password: password,
            role: updatedRole
        });
    }

    const createNewName = (name: string) => {
        newName = name;
    }

    const createNewPassword = (password: string) => {
        newPassword = password;
    }

    const createNewRoles = (roles: string[]) => {
        newRoles = roles;
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const cancelEdition = () => {
        setEditObj({
            id: 0,
            password: "",
            role: [],
            userName: ""
        });
        onClose();
    }

    const confirmEdition = () => {
        (async () => {
            let server_res = await updateUser();
            if (server_res.isSuccess) {
                let server_res = await retrieveAllUser();
                setJsonObj(server_res);
            } else {
                throw new Error(JSON.stringify(server_res));
            }
        })().finally(() => onClose());
    }

    const confirmCreation = () => {
        (async () => {
            let server_response = await createUser({
                id: null,
                userName: newName,
                password: newPassword,
                role: newRoles
            });
            if (server_response.isSuccess) {
                let retrieveUpdatedUserResponse = await retrieveAllUser();
                setJsonObj(retrieveUpdatedUserResponse);
            } else {
                throw new Error("Failed to create user");
            }
        })().finally(() => onClose());
    }

    const cancelCreation = () => {
        onClose();
    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <Input label={"Username"}
                           type={"text"}
                           defaultValue={editObj.userName}
                           onChange={(event) => updateUserName(event.target.value)}
                    />

                    <Input label={"Password"}
                           type={"text"}
                           defaultValue={editObj.password}
                           onChange={(event) => updatePassword(event.target.value)}
                    />

                    <Select
                        label={"Roles"}
                        selectionMode={"multiple"}
                        selectedKeys={new Set(editObj.role)}
                        onSelectionChange={(selection) => updateRole(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            roles.map(value =>
                                <SelectItem key={value.name} value={value.name}>
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
                    <Input label={"Username"}
                           type={"text"}
                           onChange={(event) => createNewName(event.target.value)}
                    />

                    <Input label={"Password"}
                           type={"text"}
                           onChange={(event) => createNewPassword(event.target.value)}
                    />

                    <Select
                        label={"Roles"}
                        selectionMode={"multiple"}
                        onSelectionChange={(selection) => createNewRoles(Array.from(selection, opt => opt.toString()))}
                    >
                        {
                            roles.map(value =>
                                <SelectItem key={value.name} value={value.name}>
                                    {value.name}
                                </SelectItem>
                            )
                        }
                    </Select>
                </>
            )
        }
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
                    (jsonObj.value.resultDto as UserDto[]).map((userDto, index) => (
                        <Fragment key={userDto.id}>
                            <div className={"p-4 gird-style text-center"}>
                                {userDto.id}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {userDto.userName}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {userDto.password}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                {userDto.role.join(", ")}
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                <button onClick={() => handleDelete(userDto.id)}>
                                    <FontAwesomeIcon icon={faTrash}
                                                     id={userDto.id.toString()}/>
                                </button>
                            </div>
                            <div className={"p-4 gird-style text-center"}>
                                <button onClick={() => handleEdit(userDto.id)}>
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