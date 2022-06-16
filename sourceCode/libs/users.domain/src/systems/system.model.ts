import { DatabaseObject } from "utils";

export class System extends DatabaseObject {

    constructor() {
        super();
    }

    
    /**
     * Nombre del sistema
     * System's name
     */
    name: string;

    /**
     * Codigo del sistema
     * System's code
     */
    code: string;

    /**
     * Descripcion
     * Description
     */
    description: string;

    /**
     * Cuenta de usuario al que pertenece el sistema
     * User account whos own the system
     */
    accountId: number;

    /**
     * Indice del role que se usa por default cuando un usuario usa este sistema
     * Index of the role which is used as default when a user use this system
     */
    defaultRoleIndex: number;
}
