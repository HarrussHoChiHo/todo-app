interface IUnitDto {
    id: number;
    name: string;
}

export const unitHeaders = ["ID", "Name"];

class UnitDto implements IUnitDto {
    id: number;
    name: string;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default UnitDto;