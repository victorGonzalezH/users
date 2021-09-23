import { DomainException } from 'utils';


export class BaseUser {

    constructor(username: string, systemId: string) {
        if (username == undefined || username === '') { throw new UserException('Invalid username'); }
        this.username = username;

        const regExp = /[0-9A-Fa-f]{24}/;

        if ( systemId != null && systemId.length === 24 && regExp.test(systemId) === true) {
            const system = new SystemId(systemId);
            this.systems = [];
            this.systems.push(system);
        } else {
                throw new UserException('Invalid systemId string');
        }

    }


    public username: string;

    /**
     * Arreglo de identificadores de los sistemas a los que pertenece el usario
     */
    public systems: SystemId[];

}

// tslint:disable-next-line: max-classes-per-file
export class User extends BaseUser {

    constructor(username: string, password: string, name: string, lastName: string, systemId: string) {
        super(username, systemId);

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


// tslint:disable-next-line: max-classes-per-file
export class SystemId {

    constructor(systemId: string) {
        this._id = systemId;
     }

    // tslint:disable-next-line: variable-name
    _id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UserException extends DomainException {

    constructor(message: string) { super(message); }
}

