interface ILoginQueryDto{
    name: string,
    password: string
}


class LoginQueryDto implements ILoginQueryDto {
    password: string;
    name: string;
    
    constructor(username: string,  password: string) {
        this.name     = username;
        this.password = password;
    }
}


export  default LoginQueryDto;