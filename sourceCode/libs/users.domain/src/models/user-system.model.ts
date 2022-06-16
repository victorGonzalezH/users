export class UserSystem {

    /**
     * Id of the system
     */
    _id: string;
    
    
    /**
     * Id of the default role
     */
    defaultRoleId ?: number;


    /**
     * User roles
     */
    userRoles? : number[];


    /**
     * 
     * @param systemId 
     */
    constructor(systemId: string) {
        this._id = systemId;
        this.userRoles = [];
    }
}