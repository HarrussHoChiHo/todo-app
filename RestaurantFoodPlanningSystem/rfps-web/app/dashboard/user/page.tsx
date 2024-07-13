"use client"
import React, {Fragment, useEffect, useState} from "react";
import HttpServices from "../../../lib/HttpServices";
import UserDto from "../../../lib/models/UserDto";
import {useAuth} from "../../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import RoleDto from "../../../lib/models/RoleDto";
import {
    Input,
    Select, SelectItem,
    useDisclosure
} from "@nextui-org/react";
import Modals from "../../../components/CustomModal";
import {element} from "prop-types";

export default function Page() {
    const httpServices          = new HttpServices();
    const {token}               = useAuth();
    const [jsonObj, setJsonObj] = useState<BasicDto<UserDto>>({
                                                                       error    : "",
                                                                       isSuccess: false,
                                                                       value    : {
                                                                           amount   : 0,
                                                                           resultDto: [{
                                                                               id      : 0,
                                                                               password: "",
                                                                               userName: "",
                                                                               role    : []
                                                                           }]
                                                                       }
                                                                   });
    const [roles, setRoles]     = useState<RoleDto[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [editObj, setEditObj] = useState<UserDto>({
                                                        id      : 0,
                                                        password: "",
                                                        role    : [],
                                                        userName: ""
                                                    });

    const {
              isOpen,
              onOpen,
              onClose,
              onOpenChange
          } = useDisclosure();

    useEffect(() => {
        (async function fetchData() {
            let server_res = await (await httpServices.callAPI("/user", null, "GET", token)).json();
            setJsonObj(server_res as BasicDto<UserDto>);
            if (server_res.value.resultDto) {
                setHeaders(Object.keys(server_res.value.resultDto[0]));
            }
        })();
    }, []);

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await (await httpServices.callAPI(`/User/${id}`, null, "DELETE", token)).json() as BasicDto<UserDto>;
            if (server_res.isSuccess){
                let updatedList = await (await httpServices.callAPI("/user", null, "GET", token)).json() as BasicDto<UserDto>;
                if (updatedList.isSuccess){
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
        let targetedObj;
        if (!(jsonObj.value.resultDto instanceof UserDto)) {
            [targetedObj] = jsonObj.value.resultDto.filter((dto: { id: number; }) => dto.id === id);
            setEditObj(targetedObj);
        }
        (async () => {
            let roles_res = await (await httpServices.callAPI(`/Role/read`, {
                name       : null,
                description: null,
                id         : null,
                createdDate: null
            }, "POST", token)).json();
            setRoles(roles_res.value.resultDto as RoleDto[]);

        })().then(roles => onOpen());
    }

    const updateUserName = (updatedUserName: string) => {
        let {
                id,
                role,
                password
            } = editObj;
        setEditObj({
                       id      : id,
                       userName: updatedUserName,
                       role    : role,
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
                       id      : id,
                       userName: userName,
                       role    : role,
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
                       id      : id,
                       userName: userName,
                       password: password,
                       role    : updatedRole
                   });
    }

    const cancelEdition = () => {
        setEditObj({
                       id      : 0,
                       password: "",
                       role    : [],
                       userName: ""
                   });

        onClose();
    }

    const confirmEdition = () => {
        (async () => {
            let server_res = await (await httpServices.callAPI("/user/update", editObj, "POST", token)).json() as BasicDto<UserDto>;
            if (server_res.isSuccess) {
                let server_res = await (await httpServices.callAPI("/user", null, "GET", token)).json();
                setJsonObj(server_res as BasicDto<UserDto>);
            } else {
                throw new Error(JSON.stringify(server_res));
            }
            onClose();
        })();
    }

    return (
        <>
            <div className={"grid grid-cols-6"}>
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
                                <button onClick={() => handleDelete(userDto.id)}><FontAwesomeIcon icon={faTrash}
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
                    onCancel={cancelEdition}
                    onConfirm={confirmEdition}
            >
                {
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
                                              <SelectItem key={value.name}>
                                                  {value.name}
                                              </SelectItem>
                                )
                            }
                        </Select>
                    </>
                }
            </Modals>
        </>
    );
}