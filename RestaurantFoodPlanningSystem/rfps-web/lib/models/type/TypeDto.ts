interface ITypeDto {
    id: number;
    name: string;
}

export const typeHeaders = ["ID", "Name"];

class TypeDto implements ITypeDto {
    id: number;
    name: string;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default TypeDto;