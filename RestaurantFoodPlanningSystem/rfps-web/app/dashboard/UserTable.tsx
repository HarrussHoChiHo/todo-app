import React, {Fragment, useEffect, useState} from "react";
import HttpServices from "../../lib/HttpServices";
import UserDto from "../../lib/models/UserDto";
import {useAuth} from "../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Modal from "../../components/Modal";
import RoleDto from "../../lib/models/RoleDto";
import userDto from "../../lib/models/UserDto";

export default function UserTable() {
    const httpServices                  = new HttpServices();
    const {token}                       = useAuth();
    const [jsonObj, setJsonObj]         = useState<IHttpResponse<UserDto>>({
                                                                               error    : "",
                                                                               isSuccess: false,
                                                                               value    : {
                                                                                   amount   : 0,
                                                                                   resultDto: []
                                                                               }
                                                                           });
    const [roles, setRoles]             = useState<RoleDto[]>([]);
    const [headers, setHeaders]         = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editObj, setEditObj]         = useState<UserDto>({
                                                                id      : 0,
                                                                password: "",
                                                                role    : [],
                                                                userName: ""
                                                            });

    const closeModal = () => setIsModalOpen(false);


    useEffect(() => {
        async function fetchData() {
            let server_res = await (await httpServices.callAPI("/User", null, "GET", token)).json();
            setJsonObj(server_res as IHttpResponse<UserDto>);
            if (server_res.value.resultDto) {
                setHeaders(Object.keys(server_res.value.resultDto[0]));
            }
        }

        fetchData().then(r => {
        });
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
        })().then(r => setIsModalOpen(true));
    }

    const updateUserName = (updatedUserName: string) => {
        let {
                id,
                role,
                password
            } = editObj;
        setEditObj({
                       id,
                       userName: updatedUserName,
                       role,
                       password
                   });
    }

    const updateRole = (updatedRole: string[]) => {
        let {
                id,
                userName,
                password
            } = editObj;
        setEditObj({
                       id,
                       userName,
                       password,
                       role: updatedRole
                   });
    }

    return (
        <div className={"flex flex-col justify-center items-center w-6/12 ml-auto mr-auto"}>
            <div className={"grid grid-cols-5"}>
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
                                {userDto.role.join(",")}
                            </div>
                            <div className={"p-4"}>
                                <button onClick={() => handleDelete(userDto.id)}><FontAwesomeIcon icon={faTrash}
                                                                                                  id={userDto.id.toString()}/>
                                </button>
                            </div>
                            <div className={"p-4"}>
                                <button onClick={() => handleEdit(userDto.id)}><FontAwesomeIcon icon={faPenToSquare}/>
                                </button>
                            </div>
                        </Fragment>
                    ))
                }
            </div>
            <Modal isOpen={isModalOpen}
                   onClose={closeModal}>
                <label htmlFor={"userName"}>UserName</label>
                <input id={"userName"}
                       value={editObj.userName}
                       onChange={(event) => updateUserName(event.target.value)}/>
                <label htmlFor={"role"}>UserName</label>
                <select id={"role"}
                        multiple={true}
                        onChange={(event) => updateRole(Array.from(event.target.selectedOptions, option => option.value))}>
                    {
                        roles.map(value =>
                                      <Fragment key={value.id}>
                                          <option value={value.name} selected={editObj.role.includes(value.name)}>
                                              {value.name}
                                          </option>
                                      </Fragment>
                        )
                    }
                </select>
            </Modal>
        </div>
    );
}