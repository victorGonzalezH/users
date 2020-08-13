export interface Rol {

    id: string;
    name: string;
    description: string;
    access: Access[];
}

export interface Access {

    id: string;
    elementName: string;
    write: boolean;
    delete: boolean;

}
