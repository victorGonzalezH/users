import { DatabaseObject } from "utils";
import { Access } from "../models/access.model";

/**
 * Role class
 */
export class Rol extends DatabaseObject {

    /**
     * Name of the role
     */
    name: string;
    
    /**
     * Description
     */
    description: string;

    /**
     * Access
     */
    Access: Access[];
}
