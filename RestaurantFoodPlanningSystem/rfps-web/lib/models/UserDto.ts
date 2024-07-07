import {id} from "postcss-selector-parser";

interface IUserDto {
    userName: string,
    password: string,
    role: string[]
    id: number
}


class UserDto implements IUserDto {
    password: string;
    userName: string;
    role: string[];
    id: number;

    constructor(username: string, password: string, id: number, role: string[]) {
        this.userName = username;
        this.password = password;
        this.role     = role;
        this.id       = id;
    }
}


export default UserDto;