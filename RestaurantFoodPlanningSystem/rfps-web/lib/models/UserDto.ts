interface IUserDto{
    username: string,
    password: string,
    id: number
}


class UserDto implements IUserDto {
    password: string;
    username: string;
    id: number;

    constructor(username: string,  password: string, id: number) {
        this.username     = username;
        this.password = password;
        this.id = id;
    }
}


export  default UserDto;