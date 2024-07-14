interface ITypeDto {
    id: number;
    name: string;
}

class TypeDto implements ITypeDto {
    id: number;
    name: string;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default TypeDto;