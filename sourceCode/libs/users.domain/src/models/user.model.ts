import { DomainException } from 'utils';
import { UserSystem } from './user-system.model';


export class BaseUser {

    /**
     * User name of the user
     */
    public username: string;

    /**
     * Arreglo de los sistemas a los que pertenece el usuario
     */
    public systems: UserSystem[];

    /**
     * In order to create a user, you need to pass the username, at least one system id, and at least
     * one role of the system
     * @param username user name
     * @param systemId system Id
     */
    constructor(username: string, systemId: string, roleId?: number) {
        if (username == undefined || username === '') { throw new UserException('Invalid username'); }
        this.username = username;

        const regExp = /[0-9A-Fa-f]{24}/;

        if ( systemId != null && systemId.length === 24 && regExp.test(systemId) === true) {
            const system = new UserSystem(systemId);
            if(roleId != undefined) system.userRoles.push(roleId);
            this.systems = [];
            this.systems.push(system);
        } else {
                throw new UserException('Invalid systemId string');
        }

    }
}


export class User extends BaseUser {

    /**
     * 
     * @param username 
     * @param password 
     * @param name 
     * @param lastName 
     * @param systemId 
     * @param roleId 
     */
    constructor(username: string, password: string, name: string, lastName: string, systemId: string, roleId: number) {
        
        super(username, systemId, roleId);

        if (name === undefined || name === '') { throw new UserException('Invalid name'); }
        this.name = name;

        if (password == undefined || password === '') { throw new UserException('Invalid password'); }
        this.password = password;

        if (lastName === undefined || lastName === '') { throw new UserException('Invalid lastname'); }
        this.lastName = lastName;
    }

    id?: string;

    public password: string;

    public name: string;


    public lastName: string;

}


export class UserException extends DomainException {

    constructor(message: string) { super(message); }
}

