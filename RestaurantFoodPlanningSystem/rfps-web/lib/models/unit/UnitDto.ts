interface IUnitDto {
    id: number;
    name: string;
}

export const unitHeaders = [{
    key  : "id",
    label: "ID"
}, {
    key  : "name",
    label: "Name"
}, {
    key  : "delete",
    label: "Delete"
}, {
    key  : "edit",
    label: "Edit"
}];

class UnitDto implements IUnitDto {
    id: number;
    name: string;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default UnitDto;