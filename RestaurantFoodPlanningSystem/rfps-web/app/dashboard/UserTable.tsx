import React, {Fragment, useEffect, useState} from "react";
import HttpServices from "../../lib/HttpServices";
import UserDto from "../../lib/models/UserDto";
import {useAuth} from "../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import RoleDto from "../../lib/models/RoleDto";
import {
    Input,
    Select, SelectItem,
    useDisclosure
} from "@nextui-org/react";
import Modals from "../../components/CustomModal";
import {Options} from "sucrase/dist/types/Options-gen-types";
import {Item} from "@react-stately/collections";
import {number} from "prop-types";
import {copyObject} from "@nextui-org/shared-utils";

export default function UserTable() {
    const httpServices          = new HttpServices();
    const {token}               = useAuth();
    const [jsonObj, setJsonObj] = useState<IHttpResponse<UserDto>>({
                                                                       error    : "",
                                                                       isSuccess: false,
                                                                       value    : {
                                                                           amount   : 0,
                                                                           resultDto: []
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
            let server_res = await (await httpServices.callAPI("/User", null, "GET", token)).json();
            setJsonObj(server_res as IHttpResponse<UserDto>);
            if (server_res.value.resultDto) {
                setHeaders(Object.keys(server_res.value.resultDto[0]));
            }
        })();
    }, []);

    const handleDelete = (id: number) => {
        (async () => {
            let server_res = await (await httpServices.callAPI(`/User/${id}`, null, "DELETE", token)).json();
            setJsonObj(server_res as IHttpResponse<UserDto>);
        })();
    }

    const handleEdit = (id: number) => {
        const [targetedObj] = jsonObj.value.resultDto.filter(dto => dto.id === id);
        setEditObj(targetedObj);
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
            let server_res = await (await httpServices.callAPI("/User/update", editObj, "POST", token)).json() as BasicDto<UserDto>;
            if (server_res.isSuccess) {
                let server_res = await (await httpServices.callAPI("/User", null, "GET", token)).json();
                setJsonObj(server_res as IHttpResponse<UserDto>);
            } else {
                throw new Error(JSON.stringify(server_res));
            }
            onClose();
        })();
    }

    return (
        <>
            <div className={"flex flex-col justify-center items-center w-6/12 ml-auto mr-auto"}>
                <div className={"grid grid-cols-6"}>
                    {
                        headers.map((header, index) => (
                            <Fragment key={header}>
                                <div className={"font-extrabold"}>
                                    {header}
                                </div>
                            </Fragment>
                        ))
                    }
                    <Fragment key={"header_delete"}>
                        <div className={"font-extrabold"}>
                            Delete
                        </div>
                    </Fragment>
                    <Fragment key={"header_edit"}>
                        <div className={"font-extrabold"}>
                            Edit
                        </div>
                    </Fragment>
                    {
                        jsonObj.value.resultDto.map((userDto, index) => (
                            <Fragment key={userDto.id}>
                                <div className={"p-4"}>
                                    {userDto.id}
                                </div>
                                <div className={"p-4"}>
                                    {userDto.userName}
                                </div>
                                <div className={"p-4"}>
                                    {userDto.password}
                                </div>
                                <div className={"p-4"}>
                                    {userDto.role.join(",")}
                                </div>
                                <div className={"p-4"}>
                                    <button onClick={() => handleDelete(userDto.id)}><FontAwesomeIcon icon={faTrash}
                                                                                                      id={userDto.id.toString()}/>
                                    </button>
                                </div>
                                <div className={"p-4"}>
                                    <button onClick={() => handleEdit(userDto.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>
                                </div>
                            </Fragment>
                        ))
                    }
                </div>
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