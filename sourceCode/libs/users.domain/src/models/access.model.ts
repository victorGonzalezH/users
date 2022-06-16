import { DatabaseObject } from "utils";

/**
 * Accces class
 * This class is used to specify the access to a system element.
 * A system element could be a view, a module, or even a single control
 * like a button
 *
 */
export class Access extends DatabaseObject {

    
    constructor(public elementName: string, public canWrite: boolean, public canDelete: boolean, public parentId?: string) {
        super();
    }
    
}